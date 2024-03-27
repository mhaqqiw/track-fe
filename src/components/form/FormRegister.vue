<template>
    <div class="qcard" width="100%">
        <div class="qcard" style="margin-bottom: 15px;position: sticky; top: 25px;z-index: 1000;">
            <a-flex gap="middle" align="center" justify="space-between">
                <a-col>
                    <div class="qtitle">Dari
                        <a-button type="primary" size="small" @click="modal_select_kanim = true">
                            <EditOutlined />
                        </a-button>
                    </div>
                    <div class="qvalue">{{ kanim.name }}</div>
                </a-col>
                <a-col :span="12">
                    <div class="qtitle">Ke</div>
                    <div class="qvalue">{{ address }}</div>
                </a-col>
                <a-col>
                    <a-button align="right" type="primary" @click="next">Lanjut</a-button>
                </a-col>
            </a-flex>
        </div>
        <div>
            <a-row type="flex" align="middle" class="qrow">
                <a-col :span="1" class="required">*</a-col>
                <a-col :span="23">
                    <a-select :status="error.id.status ? 'error' : 'success'" v-model:value="id" mode="tags"
                        style="width: 100%" placeholder="Nomor Permohonan" @change="handleChange"
                        @keydown="preventNonNumericInput">
                        <template #notFoundContent>
                            <a-empty
                                description="Anda diharuskan memasukkan nomor permohonan disini, anda dapat mengisi dengan beberapa nomor permohonan dalam 1 kanim" />
                        </template>
                        <a-select-option v-for="item, idx in id" :key="idx" :value="item" @click="selectId(item)">
                            {{ item }}
                        </a-select-option>
                    </a-select>
                    <label v-if="error.id.status" style="color: red;font-weight: 700;">{{ error.id.message
                        }}</label>
                </a-col>
            </a-row>
            <a-row type="flex" align="middle" class="qrow">
                <a-col :span="1" class="required">*</a-col>
                <a-col :span="23">
                    <a-input-group>
                        <a-flex>
                            <a-select v-model:value="country">
                                <a-select-option v-for="(item, idx) in phoneCodeList" :key="idx" :value="item.dial_code"
                                    style="min-width: 200px;" @click="selectCountryCode(item)">
                                    {{ item.flag }} {{ item.dial_code }}
                                </a-select-option>
                            </a-select>
                            <a-input :status="error.phone.status ? 'error' : 'success'"
                                :class="{ 'centered-placeholder': !phoneNumber }" v-model:value="phoneNumber"
                                placeholder="Nomor Telepon / HP" @keydown="preventNonNumericInput"
                                style="text-align: left;" @input="checkPhone">
                                <template #suffix>
                                    <a-tooltip title="masukkan nomor telepon / HP disini">
                                        <info-circle-outlined style="color: rgba(0, 0, 0, 0.45)" />
                                    </a-tooltip>
                                </template>
                            </a-input>
                        </a-flex>
                        <label v-if="error.phone.status" style="color: red;font-weight: 700;">{{ error.phone.message
                            }}</label>
                    </a-input-group>
                </a-col>
            </a-row>
            <a-row type="flex" align="middle" class="qrow">
                <a-col :span="1" class="required">*</a-col>
                <a-col :span="23">
                    <a-input-group>
                        <a-input :status="error.email.status ? 'error' : 'success'" v-model:value="email"
                            placeholder="Email" style="font-size: 15px;" @input="checkEmail">
                            <template #prefix>
                                <MailOutlined />
                            </template>
                            <template #suffix>
                                <a-tooltip title="masukkan email anda disini">
                                    <info-circle-outlined style="color: rgba(0, 0, 0, 0.45)" />
                                </a-tooltip>
                            </template>
                        </a-input>
                        <label v-if="error.email.status" style="color: red;font-weight: 700;">{{ error.email.message
                            }}</label>
                    </a-input-group>
                </a-col>
            </a-row>
            <!-- <a-row type="flex" align="middle" class="qrow">
                <a-col :span="1" class="required">*</a-col>
                <a-col :span="23">
                    <a-select v-model:value="postal_code" placeholder="Kode Pos" show-search style="width: 100%"
                        align="left" :filter-option="false" @search="fetchData">
                        <template #notFoundContent>
                            <a-spin v-if="fetching" size="small" />
                            <a-empty v-else
                                description="isi dengan valid kode pos, atau kamu bisa mencari denga nama provinsi, kota/kabupaten, kecamatan, desa/kelurahan" />
                        </template>
                        <a-select-option v-for="item, idx in postal_data" :key="idx"
                            :value="item.code + ' - ' + item.urban" @click="selectPostal(item)">
                            ({{ item.code }}) - {{ item.province }}, {{ item.city }}, {{ item.subdistrict }} -
                            {{ item.urban }}
                        </a-select-option>
                    </a-select>
                </a-col>
            </a-row>
            <a-row type="flex" align="middle" class="qrow">
                <a-col :span="1" class="required"></a-col>
                <a-col :span="23">
                    <a-collapse v-model:activeKey="expand_detail" class="qtitle">
                        <a-collapse-panel key="1"
                            :header="selected_postal.code ? selected_postal.code + ' - ' + selected_postal.urban : 'NA'">
                            <div class="qcard">
                                <a-flex gap="middle" vertical>
                                    <a-row>
                                        <a-col :span="7" class="qtitle">Kode Pos</a-col>
                                        <a-col :span="1">:</a-col>
                                        <a-col :span="16" class="qvalue">{{ selected_postal.code }}</a-col>
                                    </a-row>
                                    <a-row>
                                        <a-col :span="7" class="qtitle">Provinsi</a-col>
                                        <a-col :span="1">:</a-col>
                                        <a-col :span="16" class="qvalue">{{ selected_postal.province }}</a-col>
                                    </a-row>
                                    <a-row>
                                        <a-col :span="7" class="qtitle">Kota / Kabupaten</a-col>
                                        <a-col :span="1">:</a-col>
                                        <a-col :span="16" class="qvalue">{{ selected_postal.city }}</a-col>
                                    </a-row>
                                    <a-row>
                                        <a-col :span="7" class="qtitle">Kecamatan</a-col>
                                        <a-col :span="1">:</a-col>
                                        <a-col :span="16" class="qvalue">{{ selected_postal.subdistrict }}</a-col>
                                    </a-row>
                                    <a-row>
                                        <a-col :span="7" class="qtitle">Desa / Kelurahan</a-col>
                                        <a-col :span="1">:</a-col>
                                        <a-col :span="16" class="qvalue">{{ selected_postal.urban }}</a-col>
                                    </a-row>
                                </a-flex>
                            </div>
                        </a-collapse-panel>
                    </a-collapse>
                </a-col>
            </a-row> -->
            <a-row type="flex" align="middle" class="qrow">
                <a-col :span="1" class="required">*</a-col>
                <a-col :span="23">
                    <a-select v-model:value="address" placeholder="Alamat" align="left" show-search style="width: 100%;"
                        :filter-option="false" @search="fetchAddress">
                        <template #notFoundContent>
                            <a-spin v-if="fetching" size="small" />
                            <a-empty v-else description="isi dengan menulis alamatmu disini" />
                        </template>
                        <a-select-option v-for="item, idx in address_data" :key="idx" :value="item.description"
                            @click="selectAddress(item)">
                            {{ item.description }}
                        </a-select-option>
                    </a-select>
                </a-col>
            </a-row>
            <a-row type="flex" align="middle" class="qrow">
                <a-col :span="1" class="required"></a-col>
                <a-col :span="23">
                    <a-input v-model:value="detail_address" placeholder="Detil Alamat (Opsional)"
                        style="font-size: 15px;">
                        <template #prefix>
                            <FileDoneOutlined />
                        </template>
                        <template #suffix>
                            <a-tooltip
                                title="Anda dapat memasukkan detail alamat disini, seperti (sebelah alfamaret, Blok B, No. 1)">
                                <info-circle-outlined style="color: rgba(0, 0, 0, 0.45)" />
                            </a-tooltip>
                        </template>
                    </a-input>
                </a-col>
            </a-row>
            <a-row type="flex" align="middle" class="qrow">
                <a-col :span="1" class="required">*</a-col>
                <a-col :span="23">
                    <a-collapse v-model:activeKey="expand_maps" class="qtitle">
                        <a-collapse-panel key="1"
                            :header="maps_data.markerPosition.lat ? 'Latitude: ' + maps_data.markerPosition.lat + '; Longitude: ' + maps_data.markerPosition.lng : 'NA'">
                            <GoogleMap v-if="renderComponent" api-key="AIzaSyDwKe1ckc3EVUvT_RRxscuLVa5Hzts763w"
                                :center="maps_data.center" :zoom="maps_data.zoom" style="height: 400px; width: 100%">
                                <Marker :options="{ position: maps_data.markerPosition }" :draggable="true" />
                            </GoogleMap>
                        </a-collapse-panel>
                    </a-collapse>
                </a-col>
            </a-row>
            <a-row type="flex" align="middle" class="qrow">
                <a-col :span="1" class="required">*</a-col>
                <a-col :span="23">
                    <a-row>
                        <label class="qtitle">Apakah anda membawa materai (materai dibutuhkan untuk pembuatan surat
                            kuasa)?</label>
                    </a-row>
                    <a-row>
                        <a-radio-group v-model:value="use_materai" align="left">
                            <a-radio :value=false>Ya, (Anda dapat memberikan materai ke petugas)</a-radio>
                            <a-radio :value="true">Tidak, (Anda dapat membeli materai ke petugas seharga Rp.
                                {{cost}}})</a-radio>
                        </a-radio-group>
                    </a-row>
                </a-col>
            </a-row>
            <!-- <a-row type="flex" align="middle" class="qrow">
                <a-col :span="1" class="required">*</a-col>
                <a-col :span="23">
                    <a-input-group>
                        <a-row class="qrow">
                            <label class="qrow qtitle">PILIH PENGIRIMAN : </label>
                        </a-row>
                        <a-row class="qrow" style="margin-top: -20px;">
                            <a-radio-group v-model:value="send_type">
                                <a-row v-for="item, idx in send_cost" :key="idx">
                                    <a-radio :value="item.name" class="qtitle" :disabled="!item.is_enabled">{{ item.name
                                        }}: Rp. {{
                            item.price }}</a-radio>
                                </a-row>
                            </a-radio-group>
                        </a-row>
                    </a-input-group>
                </a-col>
            </a-row> -->
        </div>
    </div>
    <ModalKanim :showModal="modal_select_kanim" :kanim="list_kanim" @closeModal="closeModal" />
</template>
<script>
import { message } from "ant-design-vue";
import { debounce } from 'lodash-es';
import { FileDoneOutlined, InfoCircleOutlined, MailOutlined, EditOutlined } from '@ant-design/icons-vue';
import { GoogleMap, Marker } from 'vue3-google-map'
import { phoneCode } from '../../js/phone_code.js';
import { customFetch, KANIM, ADDRESS, POSTAL, SEND, ORDER } from '../../js/url.js';
import ModalKanim from '../modal/ModalKanim.vue';
import { useReCaptcha } from "vue-recaptcha-v3";

export default {
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
    name: 'FormRegister',
    components: { FileDoneOutlined, InfoCircleOutlined, MailOutlined, EditOutlined, GoogleMap, Marker, ModalKanim },
    data() {
        return {
            email: "",
            cost: 0,
            use_materai: true,
            send_type: 1,
            send_cost: [],
            kanim: {},
            place_id: "",
            list_kanim: [],
            modal_select_kanim: false,
            phoneNumber: "",
            renderComponent: true,
            id: [],
            phoneCodeList: [],
            country: "🇮🇩 +62",
            expand_detail: [],
            expand_maps: ['1'],
            detail_address: '',
            postal_code: "",
            postal_data: [],
            selected_postal: {},
            address: "",
            address_data: [],
            selected_address: {},
            fetching: false,
            error: {
                email: {
                    status: true,
                    message: 'Email harus diisi'
                },
                phone: {
                    status: true,
                    message: 'Nomor Telepon harus diisi'
                },
                id: {
                    status: true,
                    message: 'Nomor Permohonan harus diisi'
                }
            },
            maps_data: {
                locationInput: null,
                center: { lat: -6.2215099, lng: 106.8293873 },
                markerPosition: { lat: -6.2215099, lng: 106.8293873 },
                zoom: 19,
            }
        }
    },
    mounted() {
        this.phoneCodeList = this.sortByDialCodeAscending(phoneCode)
        this.getKanimList()
    },
    methods: {
        next() {
            if (this.email == "") {
                message.error("Email harus diisi");
                return
            }
            if (this.address == "") {
                message.error("Alamat harus diisi");
                return
            }
            if (this.kanim.code == "") {
                message.error("Kanim harus diisi");
                return
            }
            if (this.phoneNumber == "") {
                message.error("Nomor Telepon harus diisi");
                return
            }
            if (this.id.length == 0) {
                message.error("Nomor Permohonan harus diisi");
                return
            }
            this.recaptcha().then((token) => {
                let contryCode = this.country.split("+")[1];
                const requestOptions = {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "c-tok": token },
                    body: JSON.stringify({
                        request_id: this.id,
                        email: this.email,
                        phone: "+" + contryCode + "-" + this.phoneNumber,
                        to_lat: this.maps_data.center.lat,
                        to_lng: this.maps_data.center.lng,
                        address: this.address,
                        detail: this.detail_address,
                        place_id: this.place_id,
                        use_materai: this.cost > 0 ? true : false
                    }),
                };
                customFetch(ORDER + "/" + this.kanim.code, requestOptions, this.$route.meta)
                    .then((data) => {
                        if (data == undefined) {
                            throw new Error("No data");
                        }
                        localStorage.setItem("order_id", data.data.order_id)
                    })
                    .catch(() => {
                    });
            });
        },
        getSendPrice() {
            this.recaptcha().then((token) => {
                const requestOptions = {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "c-tok": token },
                    body: JSON.stringify({
                        kanim_code: this.kanim.code,
                        target: {
                            lat: this.maps_data.center.lat,
                            lng: this.maps_data.center.lng
                        }
                    }),
                };
                customFetch(SEND + "/price", requestOptions, this.$route.meta)
                    .then((data) => {
                        if (data == undefined) {
                            throw new Error("No data");
                        }
                        this.send_cost = data.data
                    })
                    .catch(() => {
                    });
            });
        },
        closeModal(value) {
            this.kanim = value
            this.modal_select_kanim = false
            let queryParams = new URLSearchParams(window.location.search);
            queryParams.set("kanim", this.kanim.code)
            window.history.pushState({}, "", "?" + queryParams.toString());
            // this.getSendPrice(this.kanim.lat, this.kanim.lng, this.maps_data.center.lat, this.maps_data.center.lng)
        },
        getKanimList() {
            customFetch(KANIM, null, this.$route.meta)
                .then((data) => {
                    if (data == undefined) {
                        throw new Error("No data");
                    }
                    this.list_kanim = data.data
                    const urlParams = new URLSearchParams(window.location.search);
                    let param = urlParams.get("kanim");
                    if (param == null || param == "" || param == undefined) {
                        this.modal_select_kanim = true
                    } else {
                        let isValid = false
                        for (let i in this.list_kanim) {
                            if (this.list_kanim[i].code == parseInt(param)) {
                                this.kanim = this.list_kanim[i]
                                isValid = true
                                break
                            }
                        }
                        if (!isValid) {
                            this.modal_select_kanim = true
                        }
                        this.maps_data.center.lat = this.kanim.lat
                        this.maps_data.center.lng = this.kanim.lng
                        this.maps_data.markerPosition.lat = this.kanim.lat
                        this.maps_data.markerPosition.lng = this.kanim.lng
                        this.forceRerender()
                    }
                })
                .catch(() => {
                });
        },
        checkEmail() {
            if (this.email == "") {
                this.error.email.status = true
                this.error.email.message = "Email harus diisi"
                return
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            console.log(emailRegex.test(this.email))
            if (emailRegex.test(this.email)) {
                this.error.email.status = false
            } else {
                this.error.email.status = true
                this.error.email.message = "Format Email tidal sesuai (contoh: coba@gmail.com)"
            }
        },
        checkPhone() {
            if (this.phone == "") {
                this.error.phone.status = true
                this.error.phone.message = "Nomor Telepon harus diisi"
            } else {
                this.error.phone.status = false
            }
        },
        sortByDialCodeAscending(countries) {
            return countries.sort((a, b) => {
                if (a.dial_code < b.dial_code) {
                    return -1;
                }
                if (a.dial_code > b.dial_code) {
                    return 1;
                }
                return 0;
            });
        },
        selectCountryCode(item) {
            console.log(item)
        },
        preventNonNumericInput(event) {
            const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete']; // Allowed keys
            if (event.key && !event.ctrlKey && !event.metaKey && !event.altKey && (event.key.length === 1 && !/\d/.test(event.key) && !allowedKeys.includes(event.key))) {
                event.preventDefault(); // Prevent input if key is not a number or allowed control key
            }
        },

        handleChange() {
            if (this.id.length > 0) {
                this.error.id.status = false
            } else {
                this.error.id.status = true
                this.error.id.message = "Nomor Permohonan harus diisi"
            }
            this.cost = 10000 * this.id.length
        },
        selectId(item) {
            console.log(item)
        },
        async forceRerender() {
            // Remove MyComponent from the DOM
            this.renderComponent = false;

            // Wait for the change to get flushed to the DOM
            await this.$nextTick();

            // Add the component back in
            this.renderComponent = true;
        },
        selectAddress(item) {
            this.place_id = item.place_id
            this.recaptcha().then((token) => {
                const requestOptions = {
                    method: "GET",
                    headers: { "Content-Type": "application/json", "c-tok": token },
                }
                customFetch(ADDRESS + '?q=' + item.description, requestOptions, this.$route.meta)
                    .then((data) => {
                        if (data == undefined) {
                            throw new Error("No data");
                        }
                        let candidates = data.data.candidates
                        if (candidates.length > 0) {
                            this.maps_data.center.lat = candidates[0].geometry.location.lat;
                            this.maps_data.center.lng = candidates[0].geometry.location.lng;

                            this.maps_data.markerPosition.lat = candidates[0].geometry.location.lat;
                            this.maps_data.markerPosition.lng = candidates[0].geometry.location.lng;
                            this.forceRerender()
                        }
                        this.expand_maps = ['1']
                        this.fetching = false;
                        // this.getSendPrice(this.kanim.lat, this.kanim.lng, this.maps_data.center.lat, this.maps_data.center.lng)
                    })
                    .catch(() => {
                        this.fetching = false;
                    });
            });

        },
        selectPostal(item) {
            this.postal_code = item.code + ' - ' + item.urban
            this.selected_postal = item
            this.expand_detail = ['1']
        },
        fetchData: debounce(function (value) {
            if (value != "") {
                this.fetching = true;
                this.recaptcha().then((token) => {
                    const requestOptions = {
                        method: "GET",
                        headers: { "Content-Type": "application/json", "c-tok": token },
                    }
                    customFetch(POSTAL + '?q=' + value, requestOptions, this.$route.meta)
                        .then((data) => {
                            this.postal_data = data.data;
                            this.fetching = false;
                        })
                        .catch(() => {
                            this.fetching = false;
                        });
                });

            } else {
                this.postal_data = [];
            }

        }, 300),
        fetchAddress: debounce(function (value) {
            if (value != "") {
                this.fetching = true;
                this.recaptcha().then((token) => {
                    const requestOptions = {
                        method: "GET",
                        headers: { "Content-Type": "application/json", "c-tok": token },
                    }
                    customFetch(ADDRESS + '?q=' + value, requestOptions, this.$route.meta)
                        .then((data) => {
                            if (data == undefined) {
                                throw new Error("No data");
                            }
                            this.address_data = data.data.predictions;
                            this.fetching = false;
                        })
                        .catch(() => {
                            this.fetching = false;
                        });
                });
            } else {
                this.postal_data = [];
            }

        }, 300)
    }
}
</script>

<style scoped>
.centered-placeholder ::placeholder {
    text-align: center;
}

.required {
    color: black;
    font-weight: 900;
}

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