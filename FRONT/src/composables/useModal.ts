import { ref } from 'vue';

const isOpen = ref(false);
const modalKey = ref<string>('place');
const modalProps = ref<Record<string, unknown>>({});
const modalTargetId = ref('body');


export function useModal() {
    const open = (key: string, props: Record<string, unknown> = {}, target:string = 'body') => {
        modalKey.value = key;
        modalProps.value = props;
        modalTargetId.value = target;
        isOpen.value = true;
    }

    const close = () => {
        isOpen.value = false;
        modalKey.value = '';
        modalTargetId.value = 'body';
        modalProps.value = {};
    }

    return {
        isOpen,
        modalKey,
        modalProps,
        modalTargetId,
        open,
        close
    }
}