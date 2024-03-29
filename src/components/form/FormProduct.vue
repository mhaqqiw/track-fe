<template>
<div class="qcard" width="100%">
    <div class="qcard" style="margin-bottom: 15px;position: sticky; top: 25px;z-index: 1000;">
            <a-flex gap="middle" align="center" justify="space-between">
                <a-col>

                </a-col>
                <a-col>

                </a-col>
                <a-col>
                    <a-button align="right" @click="back" style="margin-right: 10px;">Kembali</a-button>
                    <a-button align="right" type="primary" @click="next">Lanjut</a-button>
                </a-col>
            </a-flex>
        </div>
</div>
</template>
<script>
export default {
    name: 'FormProduct',
    methods: {
        back() {
            this.$emit("changeStep", 1);
        },
        next() {
            this.$emit("changeStep", 3);
        }
    }
}
</script>