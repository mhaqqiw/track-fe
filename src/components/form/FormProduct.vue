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
import { customFetch, PRODUCT } from '../../js/url.js';
import { useReCaptcha } from "vue-recaptcha-v3";

export default {
    name: 'FormProduct',
    setup() {
        const { executeRecaptcha, recaptchaLoaded } = useReCaptcha();

        const recaptcha = async () => {
            await recaptchaLoaded();
            const token = await executeRecaptcha("login");
            return token;
        };
        return {
            recaptcha,
        };
    },
    data() {
        return {
            products: [],
        }
    },
    mounted() {
        this.getProduct()
    },
    methods: {
        getProduct() {
            this.recaptcha().then((token) => {
                const requestOptions = {
                    method: "GET",
                    headers: { "Content-Type": "application/json", "c-tok": token },
                };
                customFetch(PRODUCT, requestOptions, this.$route.meta)
                    .then((data) => {
                        if (data == undefined) {
                            throw new Error("No data");
                        }
                        this.products = data.data
                    })
                    .catch(() => {
                    });
            });
        },
        back() {
            this.$emit("changeStep", 1);
        },
        next() {
            this.$emit("changeStep", 3);
        }
    }
}
</script>