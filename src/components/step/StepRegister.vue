<template>
    <a-steps v-if="displayStep" :items="items" :currrent="currrent" direction="horizontal"
        :responsive="false"></a-steps>
</template>

<script>
// import { UserOutlined, SolutionOutlined, DollarCircleOutlined, ShoppingCartOutlined } from '@ant-design/icons-vue';
// import { h } from 'vue';

const stepsConfig = [
    {
        title: 'Apply',
        // icon: h(UserOutlined),
    },
    {
        title: 'Review',
        // icon: h(SolutionOutlined),
    },
    {
        title: 'Tambah Produk (Optional)',
        // icon: h(ShoppingCartOutlined),
    },
    {
        title: 'Bayar',
        // icon: h(DollarCircleOutlined),
    },
];

export default {
    name: 'StepRegister',
    components: {},
    props: {
        currrent: Number,
        isMobile: Boolean
    },
    data() {
        return {
            items: [],
            displayStep: true,
        }
    },
    mounted() {
        this.updateItems();
    },
    methods: {
        updateItems() {
            this.items = stepsConfig.map(step => ({
                ...step,
                title: this.isMobile ? '' : step.title,
            }));
            this.forceRerender();
        },
        async forceRerender() {
            // Remove MyComponent from the DOM
            this.displayStep = false;

            // Wait for the change to get flushed to the DOM
            await this.$nextTick();

            // Add the component back in
            this.displayStep = true;
        },
    },
    watch: {
        isMobile: function () {
            this.updateItems();
        }
    }
}
</script>
