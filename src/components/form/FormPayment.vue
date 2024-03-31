<template>
    <div class="qcard" style="width: 100%;">
        <div class="qcard" style="margin-bottom: 15px; position: sticky; top: 25px; z-index: 1000;">
            <a-flex gap="middle" align="center" justify="space-between">
                <a-col></a-col>
                <a-col>
                    <a-button align="right" @click="back" style="margin-right: 10px;">Kembali</a-button>
                </a-col>
            </a-flex>
        </div>
    </div>
    <div class="qcard" v-if="order != null">
        <a-list class="qcard" item-layout="horizontal" :data-source="order.cost_data"
            style="max-width: 100%;overflow-x: auto;">
            <template #renderItem="{ item }">
                <a-list-item>
                    <a-row style="min-width: 500px;" align="center">
                        <a-col :span="6" :align="item.is_title ? 'center' : 'left'"
                            :class="{ qtitle: item.is_title }">{{ item.name }}</a-col>
                        <a-col :span="4" :class="{ qtitle: item.is_title }">{{ item.quantity }}</a-col>
                        <a-col :span="6" :class="{ qtitle: item.is_title || item.is_last }">{{ item.is_title
                        || item.is_last ? item.price :
                        formatCurrency(item.price) }}</a-col>
                        <a-col :span="8" :class="{ qtitle: item.is_title || item.is_last }">{{ item.is_title
                        ? item.total
                        : formatCurrency(item.total) }}</a-col>
                    </a-row>
                </a-list-item>
            </template>
        </a-list>
    </div>
    <a-button type="primary" align="center" @click="pay">Bayar</a-button>
</template>

<script>
import { customFetch, ORDER, ADDITIONAL } from '../../js/url.js';
import { useReCaptcha } from "vue-recaptcha-v3";
import { formatCurrency } from '../../js/module.js'

export default {
    name: 'FormPayment',
    components: {},
    emits: ["changeStep"],
    data() {
        return {
            formatCurrency: formatCurrency,
            order: null,
            adds: [],
            total: 0
        }
    },
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
    mounted() {
        let orderId = localStorage.getItem("order_id")
        if (orderId != "" && orderId != undefined && orderId != null) {
            this.getData(orderId)
        }
    },
    methods: {
        back() {
            this.$emit("changeStep", 2);
        },
        pay() { },
        getData(id) {
            this.recaptcha().then((token) => {
                const requestOptions = {
                    method: "GET",
                    headers: { "Content-Type": "application/json", "c-tok": token },
                };
                customFetch(ORDER + "/" + id, requestOptions, this.$route.meta)
                    .then((data) => {
                        if (data == undefined) {
                            throw new Error("No data");
                        }
                        if (data.data == null || data.data.length == 0) {
                            localStorage.removeItem("order_id");
                            this.back()
                            return
                        }
                        this.order = data.data[0]
                        this.order.cost_data.unshift({
                            name: "Item",
                            quantity: "Jumlah",
                            price: "Harga",
                            total: "Total",
                            is_title: true
                        });


                        if (data.data[0].order_data.additional != null && data.data[0].order_data.additional.length > 0) {
                            this.getAdds(id)
                        } else {
                            this.order.cost_data.push({
                                name: "",
                                quantity: "",
                                price: "Total",
                                total: this.order.total,
                                is_last: true
                            })
                        }
                    })
                    .catch(() => {
                    });
            });
        },
        getAdds(id) {
            this.recaptcha().then((token) => {
                const requestOptions = {
                    method: "GET",
                    headers: { "Content-Type": "application/json", "c-tok": token },
                }
                customFetch(ADDITIONAL + "/" + id, requestOptions, this.$route.meta).then((data) => {
                    if (data == undefined) {
                        throw new Error("No data");
                    }
                    let total = 0
                    this.adds = data.data
                    if (this.adds != null && this.adds.length > 0) {
                        for (let i in this.adds) {
                            this.order.cost_data.push({
                                name: this.adds[i].name,
                                quantity: this.adds[i].quantity,
                                price: this.adds[i].price,
                                total: this.adds[i].price * this.adds[i].quantity,
                            })
                            total += this.adds[i].price * this.adds[i].quantity
                        }

                    }
                    this.order.cost_data.push({
                        name: "",
                        quantity: "",
                        price: "Total",
                        total: this.order.total + total,
                        is_last: true
                    })
                }).catch(() => {
                })
            })
        },
    }
}
</script>
