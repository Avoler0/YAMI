
export function useGeoPosition() {
    const getUserPosition = (): Promise<{ lat: number, lng: number }> => {
        return new Promise((resolve, reject) => {
            if (!('geolocation' in navigator)) {
                return reject(new Error('Geolocation is not supported.'));
            }

            navigator.geolocation.getCurrentPosition(
                (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                (err) => reject(err)
            );
        });
    };

    return { getUserPosition };
}