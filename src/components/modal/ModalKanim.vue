<template>
    <a-modal v-bind:open="showModal" title="PILIH KANIM" :closable="false">
        <template #footer>
            <a-button key="submit" type="primary" @click="handleOk" :disabled="!selected_kanim">Submit</a-button>
        </template>
        <a-select ref="select" v-model:value="selected_kanim" style="width: 90%">
            <a-select-option v-for="item, idx in kanim" :key="idx" :value="item.name" @click="select(item)">{{ item.name
                }}</a-select-option>
        </a-select>
    </a-modal>
</template>

<script>
export default {
    name: 'ModalKanim',
    emits: ["closeModal"],
    props: {
        kanim: Array,
        showModal: Boolean,
    },
    data() {
        return {
            selected_kanim: "",
            kanimData: {}

        }
    },
    methods: {
        handleOk() {

            this.$emit("closeModal", this.kanimData);
        },
        select(item) {
            this.kanimData = item
        }
    }
}
</script>