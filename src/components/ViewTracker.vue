<template>
    <a-tabs v-model:activeKey="activeKey" style="max-width: 90%;width: 100%;">
        <a-tab-pane key="register">
            <template #tab>
                <span>
                    <AppstoreAddOutlined />
                    Buat Permohonan
                </span>
            </template>
            <StepRegister :current="step" :isMobile="is_mobile" style="margin-bottom: 25px;"/>
            <div v-if="step == 0">
                <FormRegister @changeStep="changeStep" />
            </div>
            <div v-else-if="step == 1">
                <FormReview @changeStep="changeStep" />
            </div>
            <div v-else-if="step == 2">
                <FormProduct @changeStep="changeStep" />
            </div>
            <div v-else-if="step == 3">
            </div>
        </a-tab-pane>
        <a-tab-pane key="track">
            <template #tab>
                <span>
                    <FileSearchOutlined />
                    Lacak
                </span>
            </template>
            Tab 2
        </a-tab-pane>
    </a-tabs>
</template>
<script>
import { AppstoreAddOutlined, FileSearchOutlined } from '@ant-design/icons-vue';
import FormRegister from './form/FormRegister.vue';
import FormReview from './form/FormReview.vue';
import FormProduct from './form/FormProduct.vue';
import StepRegister from './step/StepRegister.vue';

export default {
    components: { AppstoreAddOutlined, FileSearchOutlined, FormRegister, FormReview, FormProduct, StepRegister },
    data() {
        return {
            activeKey: 'register',
            step: 0
        }
    },
    props: {
        user: Object,
        is_mobile: Boolean
    },
    mounted() {
    },
    methods:{
        changeStep(value){
            this.step = value
        }
    }
}
</script>