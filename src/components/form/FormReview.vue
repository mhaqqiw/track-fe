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
        <div v-if="order != null" class="qcard">
            <a-row style="width: 100%;">
                <div class="qtitle" align="center" style="width: 100%;">Informasi Pemohon:</div>
                <div class="qcard" align="left" style="width: 100%;">
                    <a-row>
                        <a-col :span="5" class="qtitle">Nama</a-col>
                        <a-col>{{ order.order_data.name }}</a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="5" class="qtitle">Email</a-col>
                        <a-col>{{ order.order_data.email }}</a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="5" class="qtitle">Nomor Telepon</a-col>
                        <a-col>{{ order.order_data.phone }}</a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="5" class="qtitle">Jarak</a-col>
                        <a-col>{{ order.distance.toFixed(2) }} Km</a-col>
                    </a-row>
                    <a-row>
                        <a-col :span="5" class="qtitle">Nomor Permohonan</a-col>
                        <a-col>
                            <a-tag v-for="item in order.order_data.request_id" :key="item" color="#2db7f5">{{item}}</a-tag>
                        </a-col>
                    </a-row>
                </div>
            </a-row>
            <a-flex justify="space-evenly" :align="'center'" gap="small" wrap="wrap">
                <div style="width: 500px;">
                    <div class="qtitle" align="center">Detail Pengiriman:</div>
                    <div>
                        <a-row class="qtitle" align="center">
                            Dari:
                        </a-row>
                        <a-row class="qcard" align="left">
                            <div align="left">
                                <a-row class="qtitle">Nama Kanim</a-row>
                                <a-row>{{ order.kanim_data.name }}</a-row>
                            </div>
                            <div align="left">
                                <a-row class="qtitle">Alamat Kanim</a-row>
                                <a-row>{{ order.kanim_data.address }}</a-row>
                            </div>
                            <div align="left">
                                <a-row class="qtitle">Kordinat</a-row>
                                <a-row>{{ order.kanim_data.lat }}, {{ order.kanim_data.lng }}</a-row>
                            </div>
                        </a-row>
                        <a-row class="qtitle" align="center">
                            Ke:
                        </a-row>
                        <a-row class="qcard">
                            <div align="left">
                                <a-row class="qtitle">Alamat Pengiriman</a-row>
                                <a-row>{{ order.order_data.address }}</a-row>
                            </div>
                            <div align="left" v-if="show_detail">
                                <a-row class="qtitle">Detail Alamat</a-row>
                                <a-row>{{ order.order_data.detail_address }}</a-row>
                            </div>
                            <div align="left">
                                <a-row class="qtitle">Kordinat</a-row>
                                <a-row>{{ order.order_data.to_lat }}, {{ order.order_data.to_lng }}</a-row>
                            </div>
                        </a-row>
                    </div>
                </div>
                <div style="max-width: 100%;">
                    <a-row class="qtitle" align="center">
                        Biaya:
                    </a-row>
                    <a-list class="qcard" item-layout="horizontal" :data-source="order.cost_data" style="max-width: 100%;overflow-x: auto;">
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
            </a-flex>
        </div>
        <div v-if="order != null">
            <GoogleMap api-key="AIzaSyC8Xa5ec0TBZ_1Fc4hlax9JrsRQLVg1Pmk"
                :center="getCenterCoordinate({ lat: order.order_data.to_lat, lng: order.order_data.to_lng }, {lat: order.order_data.from_lat, lng: order.order_data.from_lng})" :zoom="10"
                style="height: 400px; width: 100%">
                <Marker :options="{ position: { lat: order.order_data.to_lat, lng: order.order_data.to_lng } }">
                    <InfoWindow>
                        <div id="content">
                            <div id="siteNotice"></div>
                            <h1 id="firstHeading" class="firstHeading">{{ order.order_data.address }}</h1>
                            <div id="bodyContent">
                                {{ order.order_data.detail_address }}
                                <p>Attribution: Testing, <a
                                        href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">
                                        https://en.wikipedia.org/w/index.php?title=Uluru</a>
                                    (last visited June 22, 2009).</p>
                            </div>
                        </div>
                    </InfoWindow>
                </Marker>
                <Marker :options="{ position: { lat: order.order_data.from_lat, lng: order.order_data.from_lng } }">
                    <InfoWindow>
                        <div id="content">
                            <div id="siteNotice"></div>
                            <h1 id="firstHeading" class="firstHeading">{{ order.kanim_data.name }}</h1>
                            <div id="bodyContent">
                                {{ order.kanim_data.address }}
                                <p>Attribution: Kanim, <a
                                        href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">
                                        https://en.wikipedia.org/w/index.php?title=Uluru</a>
                                    (last visited June 22, 2009).</p>
                            </div>
                        </div>
                    </InfoWindow>
                </Marker>
            </GoogleMap>
        </div>
    </div>
</template>
<script>
import { GoogleMap, Marker, InfoWindow } from 'vue3-google-map'
import { customFetch, ORDER } from '../../js/url.js';
import { useReCaptcha } from "vue-recaptcha-v3";

export default {
    name: 'FormReview',
    components: { GoogleMap, Marker, InfoWindow },
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
    props: {
        user: Object,
        is_mobile: Boolean
    },
    data() {
        return {
            order: null,
            show_detail: false,
            cost: [],
        }
    },
    emits: ["changeStep"],
    mounted() {
        let orderId = localStorage.getItem("order_id")
        if (orderId != "" && orderId != undefined && orderId != null) {
            this.getData(orderId)
        } else {
            this.back()
        }

    },
    methods: {
        getCenterCoordinate(coord1, coord2) {
            
            // Extract latitude and longitude from coordinates
            let lat1 = coord1.lat;
            let lng1 = coord1.lng;
            let lat2 = coord2.lat;
            let lng2 = coord2.lng;

            console.log(lat1, lng1, lat2, lng2)

            // Calculate the center coordinates
            let centerLat = (lat1 + lat2) / 2;
            let centerLng = (lng1 + lng2) / 2;

            // Return the center coordinates
            return { lat: centerLat, lng: centerLng };
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
                        this.order = data.data[0]
                        if (this.order.order_data.detail_address == null || this.order.order_data.detail_address == "" || this.order.order_data.detail_address == undefined) {
                            this.show_detail = false
                        } else {
                            this.show_detail = true

                        }
                        this.order.cost_data.unshift({
                            name: "Item",
                            quantity: "Jumlah",
                            price: "Harga",
                            total: "Total",
                            is_title: true
                        });
                        this.order.cost_data.push({
                            name: "",
                            quantity: "",
                            price: "Total",
                            total: this.order.total,
                            is_last: true
                        })
                    })
                    .catch(() => {
                    });
            });
        },
        next() {
            this.$emit("changeStep", 2);
        },
        back() {
            this.$emit("changeStep", 0);
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
        }

    }
}
</script>
<style>
.qrow {
    margin-bottom: 10px;
    margin: 25px;
}

.qcard {
    background: white;
    padding: 5px;
    margin: 5px;
    box-shadow: 5px 5px 8px rgba(0, 0, 0, 0.1);
    min-width: 23%;
}

.qcard:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    transition: box-shadow 0.3s ease-in-out;
}

.qtitle {
    font-weight: 900;
    text-align: left;
}

.qvalue {
    text-align: left;
}

.qcard-content {
    text-align: left;
    margin-bottom: 25px;
    margin-top: 10px;
}
</style>