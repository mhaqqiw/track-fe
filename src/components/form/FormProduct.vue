<template>
    <div class="qcard" width="100%">
        <div class="qcard" style="margin-bottom: 15px;position: sticky; top: 25px;z-index: 1000;">
            <a-flex gap="middle" align="center" justify="space-between" style="width: 100%;overflow-x: auto;">
                <a-col>
                </a-col>
                <a-col>
                    <a-button align="right" @click="back" style="margin-right: 10px;">Kembali</a-button>
                    <a-button align="right" type="primary" @click="next">Lanjut</a-button>
                </a-col>
            </a-flex>
        </div>
        <div>
            <a-flex gap="middle" align="center" justify="space-between" style="width: 100%;overflow-x: auto;">
                <a-card v-for="item in products" :key="item.id" hoverable style="min-width: 300px">
                    <template #cover>
                        <img alt="example"
                            :src="item.image_url != null && item.image_url.length > 0 ? item.image_url[0] : default_image" />
                    </template>
                    <template #actions>
                        <div>
                            <a-row>
                                <a-col :span="7" style="margin-left: 10px;">
                                    <a-row>
                                        {{ item.quantity }}
                                    </a-row>
                                    <a-row>
                                        {{ formatCurrency(item.price) }}
                                    </a-row>
                                </a-col>
                                <a-col :span="8">
                                    <a-button type="primary" shape="rounded" @click="select(item)"
                                        :disabled="item.quantity == 0">
                                        <PlusCircleOutlined />Tambah
                                    </a-button>
                                </a-col>
                                <a-col :span="8" align="right">
                                    <a-button disabled>
                                        <ArrowRightOutlined />
                                    </a-button>
                                </a-col>
                            </a-row>
                        </div>
                    </template>
                    <a-card-meta :title="item.name" :description="'item.desc'">

                    </a-card-meta>
                </a-card>
            </a-flex>
        </div>
        <div class="qcard">
            <a-list item-layout="horizontal" :data-source="products" style="max-width: 100%;overflow-x: auto;">
                <template #renderItem="{ item }">
                    <a-list-item v-if="item.added > 0" align="left" style="min-width: 700px;">
                        <a-list-item-meta :description="item.desc">
                            <template #title>
                                <a href="">{{ item.name }}</a>
                            </template>
                            <template #avatar>
                                <a-avatar
                                    :src="item.image_url != null && item.image_url.length > 0 ? item.image_url[0] : default_image" />
                            </template>
                        </a-list-item-meta>
                        <label style="margin-left: 10px;">{{ formatCurrency(item.price) }}</label>
                        <a-input v-model:value="item.added" style="width: 120px;margin-left: 10px;" disabled>
                            <template #addonBefore>
                                <MinusOutlined @click="changeCounter('-1', item)" />
                            </template>
                            <template #addonAfter>
                                <PlusOutlined @click="changeCounter('1', item)" />
                            </template>
                        </a-input>
                        <label style="margin-left: 10px;">{{ formatCurrency(item.added * item.price) }}</label>
                        <a-button @click="remove(item)" type="primary" danger style="margin-left: 10px;">
                            <DeleteOutlined />
                        </a-button>
                    </a-list-item>
                </template>
            </a-list>
        </div>
        <div class="qtitle" style="text-align: center;">
            Total {{ formatCurrency(total()) }}
        </div>
    </div>
</template>
<script>
import { customFetch, PRODUCT, ORDER, ADDITIONAL } from '../../js/url.js';
import { useReCaptcha } from "vue-recaptcha-v3";
import { ArrowRightOutlined, PlusCircleOutlined, DeleteOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons-vue';

export default {
    name: 'FormProduct',
    components: {
        ArrowRightOutlined,
        PlusCircleOutlined,
        DeleteOutlined,
        PlusOutlined,
        MinusOutlined
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
    data() {
        return {
            products: [],
            default_image: "data:image/png;base64,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"
        }
    },
    mounted() {
        this.getProduct()
    },
    methods: {
        total() {
            let total = 0
            for (let i in this.products) {
                total = total + (this.products[i].added * this.products[i].price)
            }
            return total
        },
        remove(item) {
            item.quantity += item.added
            item.added = 0
        },
        changeCounter(val, item) {
            if (val == '-1') {
                item.quantity += 1
                item.added -= 1
            } else {
                if (item.quantity == 0) return
                item.quantity -= 1
                item.added += 1
            }
        },
        select(item) {
            item.quantity -= 1
            item.added += 1
        },
        formatCurrency(amount) {
            // Convert the integer amount to a string
            let strAmount = amount.toString();

            // Determine the position of the decimal point
            let decimalIndex = strAmount.length - 2;

            // Insert commas for thousands separator
            for (let i = decimalIndex - 3; i > 0; i -= 3) {
                strAmount = strAmount.slice(0, i) + ',' + strAmount.slice(i);
            }

            // If the number is negative, prepend a '-'
            if (amount < 0) {
                strAmount = '-' + strAmount;
            }

            // Add the currency symbol and return the formatted string
            return 'Rp. ' + strAmount;
        },
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

                        for (let i in data.data) {
                            data.data[i].added = 0
                        }
                        this.products = data.data
                        let orderId = localStorage.getItem("order_id")
                        if (orderId != "" && orderId != undefined && orderId != null) {
                            this.getData(orderId)
                        }
                    })
                    .catch(() => {
                    });
            });
        },
        back() {
            this.$emit("changeStep", 1);
        },
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
                        if (data.data[0].order_data.additional != null && data.data[0].order_data.additional.length > 0) {
                            this.getAdds(id)
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
                    for (let i in data.data) {
                        for (let j in this.products) {
                            if (this.products[j].product_id == data.data[i].product) {
                                if (data.data[i].quantity > this.products[j].quantity) {
                                    this.products[j].added = this.products[j].quantity
                                    this.products[j].quantity = 0
                                } else {
                                    this.products[j].added = data.data[i].quantity
                                    this.products[j].quantity -= data.data[i].quantity
                                }
                                break
                            }
                        }
                    }
                }).catch(() => {
                })
            })
        },
        next() {
            let arr = []
            for (let i in this.products) {
                if (this.products[i].added > 0) {
                    arr.push({
                        quantity: this.products[i].added,
                        product: this.products[i].product_id
                    })
                }
            }
            let orderId = localStorage.getItem("order_id")
            this.recaptcha().then((token) => {
                const requestOptions = {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "c-tok": token },
                    body: JSON.stringify(arr)
                };
                customFetch(ADDITIONAL + "/" + orderId, requestOptions, this.$route.meta)
                    .then((data) => {
                        if (data == undefined) {
                            throw new Error("No data");
                        }
                        this.$emit("changeStep", 3);
                    })
                    .catch(() => {
                    });
            });
        }
    }
}
</script>