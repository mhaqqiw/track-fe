<template>
    <div class="qcard" width="100%">
        <div class="qcard" style="margin-bottom: 15px;position: sticky; top: 25px;z-index: 1000;">
            <a-flex gap="middle" align="center" justify="space-between">
                <a-col>
                    <div class="qtitle">Dari</div>
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
                    <a-input-group>
                        <a-select :status="error.id.status ? 'error' : 'success'" v-model:value="id" mode="tags"
                            style="width: calc(100% - 5px)" placeholder="Nomor Permohonan" @change="handleChange"
                            @keydown="preventNonNumericInput">
                            <template #notFoundContent>
                                <a-empty
                                    description="Anda diharuskan memasukkan nomor permohonan disini, anda dapat mengisi dengan beberapa nomor permohonan dalam 1 kanim" />
                            </template>
                            <a-select-option v-for="item, idx in id" :key="idx" :value="item">
                                {{ item }}
                            </a-select-option>
                        </a-select>
                        <a-button type="primary" style="margin-left: -45px;" @click="displayQR = true">
                            <CameraOutlined />
                        </a-button>
                    </a-input-group>
                    <QRCode @addData="addData" :display="displayQR"></QRCode>
                    <label v-if="error.id.status" style="color: red;font-weight: 700;">{{ error.id.message
                        }}</label>
                </a-col>
            </a-row>
            <a-row type="flex" align="middle" class="qrow">
                <a-col :span="1" class="required">*</a-col>
                <a-col :span="23">
                    <a-input-group>
                        <a-input :status="error.name.status ? 'error' : 'success'" v-model:value="name"
                            placeholder="Nama Pemohon" style="font-size: 15px;" @input=checkName>
                            <template #prefix>
                                <UserOutlined />
                            </template>
                            <template #suffix>
                                <a-tooltip title="masukkan nama anda disini">
                                    <info-circle-outlined style="color: rgba(0, 0, 0, 0.45)" />
                                </a-tooltip>
                            </template>
                        </a-input>
                        <label v-if="error.name.status" style="color: red;font-weight: 700;">{{ error.name.message
                            }}</label>
                    </a-input-group>
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
                            <GoogleMap v-if="renderComponent" api-key="AIzaSyC8Xa5ec0TBZ_1Fc4hlax9JrsRQLVg1Pmk"
                                :center="maps_data.center" :zoom="maps_data.zoom" style="height: 400px; width: 100%">
                                <Marker :options="{ position: maps_data.markerPosition, draggable: true }"
                                    @dragend="markerDragend">
                                    <InfoWindow>
                                        <div id="content">
                                            <div id="siteNotice"></div>
                                            <h1 id="firstHeading" class="firstHeading">{{ address }}</h1>
                                            <div id="bodyContent">
                                                {{ detail_address }}
                                                <p>Attribution: Testing, <a
                                                        href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">
                                                        https://en.wikipedia.org/w/index.php?title=Uluru</a>
                                                    (last visited June 22, 2009).</p>
                                            </div>
                                        </div>
                                    </InfoWindow>
                                </Marker>
                                <Marker :options="{ position: { lat: kanim.lat, lng: kanim.lng } }">
                                    <InfoWindow>
                                        <div id="content">
                                            <div id="siteNotice"></div>
                                            <h1 id="firstHeading" class="firstHeading">{{ kanim.name }}</h1>
                                            <div id="bodyContent">
                                                {{ kanim.address }}
                                                <p>Attribution: Kanim, <a
                                                        href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">
                                                        https://en.wikipedia.org/w/index.php?title=Uluru</a>
                                                    (last visited June 22, 2009).</p>
                                            </div>
                                        </div>
                                    </InfoWindow>
                                </Marker>
                            </GoogleMap>
                            <div id="map"></div>
                        </a-collapse-panel>
                    </a-collapse>
                </a-col>
            </a-row>
            <a-row type="flex" align="middle" class="qrow">
                <a-col :span="1" class="required">*</a-col>
                <a-col :span="23">
                    <a-row>
                        <label class="qtitle">Biaya Pengiriman:</label>
                    </a-row>
                    <a-row v-if="send_cost.length > 0">
                        <a-col style="width: 100%">
                            <a-row>
                                <a-col :span="10" class="qtitle">Jasa Pengiriman:</a-col>
                                <a-col>{{ send_cost[0].name }}</a-col>
                            </a-row>
                            <a-row>
                                <a-col :span="10" class="qtitle">Tipe Pengiriman:</a-col>
                                <a-col v-if="error.send.status">{{ error.send.message }}</a-col>
                                <a-col v-else>{{ send_cost[0].type }}</a-col>
                            </a-row>
                            <a-row>
                                <a-col :span="10" class="qtitle">Jarak:</a-col>
                                <a-col>{{ send_cost[0].distance.toFixed(2) }} Km</a-col>
                            </a-row>
                            <a-row>
                                <a-col :span="10" class="qtitle">Harga:</a-col>
                                <a-col>{{ formatCurrency(send_cost[0].price) }}</a-col>
                            </a-row>
                        </a-col>
                    </a-row>
                </a-col>
            </a-row>
            <!-- <a-row type="flex" align="middle" class="qrow">
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
                                {{ cost }})</a-radio>
                        </a-radio-group>
                    </a-row>
                </a-col>
            </a-row> -->
            <a-row type="flex" align="middle" class="qrow">
                <a-col :span="1" class="required">*</a-col>
                <a-col :span="23">
                    <a-row>
                        <label class="qtitle">Biaya Layanan: {{ formatCurrency(20000) }}</label>
                    </a-row>
                </a-col>
            </a-row>
        </div>
    </div>
</template>
<script>
import { message } from "ant-design-vue";
import { debounce } from 'lodash-es';
import { FileDoneOutlined, InfoCircleOutlined, MailOutlined, UserOutlined, CameraOutlined } from '@ant-design/icons-vue';
import { GoogleMap, Marker, InfoWindow } from 'vue3-google-map'
import { phoneCode } from '../../js/phone_code.js';
import { customFetch, ADDRESS, ORDER, KANIM, SEND } from '../../js/url.js';
import { useReCaptcha } from "vue-recaptcha-v3";
import QRCode from '../QRCode.vue'
import { formatCurrency } from '../../js/module.js'

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
    components: { FileDoneOutlined, InfoCircleOutlined, MailOutlined, UserOutlined, CameraOutlined, GoogleMap, Marker, InfoWindow, QRCode },
    data() {
        return {
            formatCurrency: formatCurrency,
            displayQR: false,
            name: "",
            email: "",
            cost: 0,
            send_cost: [],
            use_materai: false,
            kanim: { lat: -6.2215099, lng: 106.8293873 },
            place_id: "",
            phoneNumber: "",
            renderComponent: true,
            id: [],
            phoneCodeList: [],
            country: "🇮🇩 +62",
            selected_country: {
                "name": "Indonesia",
                "flag": "🇮🇩",
                "code": "ID",
                "dial_code": "+62"
            },
            expand_maps: ['1'],
            detail_address: '',
            address: "",
            address_data: [],
            selected_address: {},
            fetching: false,
            initial_data: {},
            error: {
                email: {
                    status: false,
                    message: 'Email harus diisi'
                },
                phone: {
                    status: false,
                    message: 'Nomor Telepon harus diisi'
                },
                id: {
                    status: false,
                    message: 'Nomor Permohonan harus diisi'
                },
                name: {
                    status: false,
                    message: 'Nama harus diisi'
                },
                send: {
                    status: false,
                    message: "Jasa Pengiriman tidak tersedia"
                }
            },
            maps_data: {
                locationInput: null,
                center: { lat: -6.2215099, lng: 106.8293873 },
                markerPosition: { lat: -6.2215099, lng: 106.8293873 },
                zoom: 10,
            }
        }
    },
    emits: ["changeStep"],
    mounted() {
        this.phoneCodeList = this.sortByDialCodeAscending(phoneCode)
        let orderId = localStorage.getItem("order_id")
        if (orderId != "" && orderId != undefined && orderId != null) {
            this.getOrder(orderId)
        }
    },
    methods: {
        addData(value) {
            if (value != null) {
                this.id.push(value)
                this.handleChange()
            }
            this.displayQR = false
        },
        markerDragend(event) {
            this.maps_data.markerPosition.lat = event.latLng.lat()
            this.maps_data.markerPosition.lng = event.latLng.lng()
            this.getPrice()
        },
        compareData() {
            return this.initial_data.request_id == this.id &&
                this.initial_data.name == this.name &&
                this.initial_data.email == this.email &&
                this.initial_data.address == this.address &&
                this.initial_data.detail_address == this.detail_address &&
                this.initial_data.phone == this.selected_country.dial_code + "-" + this.phoneNumber &&
                this.initial_data.to_lat == this.maps_data.markerPosition.lat &&
                this.initial_data.to_lng == this.maps_data.markerPosition.lng
        },
        getOrder(id) {
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
                            return
                        }
                        this.initial_data = data.data[0].order_data
                        this.id = data.data[0].order_data.request_id
                        this.name = data.data[0].order_data.name
                        this.checkName()
                        this.email = data.data[0].order_data.email
                        this.checkEmail()
                        this.address = data.data[0].order_data.address
                        this.maps_data.markerPosition.lat = data.data[0].order_data.to_lat
                        this.maps_data.markerPosition.lng = data.data[0].order_data.to_lng
                        this.selectAddress({ place_id: data.data[0].order_data.place_id, description: data.data[0].order_data.address }, false)
                        this.setPhone(data.data[0].order_data.phone)
                        this.handleChange()
                        this.detail_address = data.data[0].order_data.detail_address
                    })
                    .catch(() => {
                    });
            });
        },
        setPhone(phone) {
            let arr = phone.split('-')
            for (let i in this.phoneCodeList) {
                if (this.phoneCodeList[i].dial_code == arr[0]) {
                    this.selected_country = this.phoneCodeList[i]
                    break
                }
            }
            this.phoneNumber = arr[1]
            this.checkPhone()
        },
        getCenterCoordinate(coord1, coord2) {
            // Extract latitude and longitude from coordinates
            let lat1 = coord1.lat;
            let lng1 = coord1.lng;
            let lat2 = coord2.lat;
            let lng2 = coord2.lng;

            // Calculate the center coordinates
            let centerLat = (lat1 + lat2) / 2;
            let centerLng = (lng1 + lng2) / 2;

            // Return the center coordinates
            return { lat: centerLat, lng: centerLng };
        },
        next() {
            if (this.compareData()) {
                this.$emit("changeStep", 1);
                return
            }

            if (this.name == "") {
                message.error("Nama harus diisi");
                return
            }
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
            if (this.error.send.status) {
                message.error(this.error.send.message);
                return
            }
            this.recaptcha().then((token) => {
                let url = ORDER + "/" + this.kanim.code
                let method = "POST"
                let orderId = localStorage.getItem("order_id")

                if (orderId != "" && orderId != undefined && orderId != null) {
                    url = ORDER + "/" + orderId
                    method = "PUT"
                }
                const requestOptions = {
                    method: method,
                    headers: { "Content-Type": "application/json", "c-tok": token },
                    body: JSON.stringify({
                        request_id: this.id,
                        name: this.name,
                        email: this.email,
                        phone: this.selected_country.dial_code + "-" + this.phoneNumber,
                        to_lat: this.maps_data.markerPosition.lat,
                        to_lng: this.maps_data.markerPosition.lng,
                        address: this.address,
                        detail: this.detail_address,
                        place_id: this.place_id,
                        use_materai: false,
                        additional: this.initial_data.additional
                    }),
                };
                customFetch(url, requestOptions, this.$route.meta)
                    .then((data) => {
                        if (data == undefined) {
                            throw new Error("No data");
                        }
                        localStorage.setItem("order_id", data.data.order_id)
                        this.$emit("changeStep", 1);
                    })
                    .catch(() => {
                    });
            });
        },
        checkName() {
            if (this.name == "") {
                this.error.name.status = true
                this.error.name.message = "Nama harus diisi"
            } else {
                this.error.name.status = false
            }
        },
        checkEmail() {
            if (this.email == "") {
                this.error.email.status = true
                this.error.email.message = "Email harus diisi"
                return
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
            this.selected_country = item
        },
        preventNonNumericInput(event) {
            const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete']; // Allowed keys
            if (event.key && !event.ctrlKey && !event.metaKey && !event.altKey && (event.key.length === 1 && !/\d/.test(event.key) && !allowedKeys.includes(event.key))) {
                event.preventDefault(); // Prevent input if key is not a number or allowed control key
            }
        },
        getPrice() {
            if (this.kanim == {} || this.maps_data.markerPosition.lat == 0 || this.maps_data.markerPosition.lng == 0) {
                return
            }
            this.recaptcha().then((token) => {
                const requestOptions = {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "c-tok": token },
                    body: JSON.stringify({
                        kanim_code: this.kanim.code,
                        target: {
                            lat: this.maps_data.markerPosition.lat,
                            lng: this.maps_data.markerPosition.lng
                        }
                    })
                }
                customFetch(SEND + "/price", requestOptions, this.$route.meta)
                    .then((data) => {
                        if (data == undefined) {
                            throw new Error("No data");
                        }
                        if (data.data == null || data.data.length == 0) {
                            message.error("Tidak ada jasa pengiriman yang tersedia")
                            this.error.send.status = true
                            this.error.send.message = "Tidak ada jasa pengiriman yang tersedia"
                            return
                        }
                        if (data.data[0].price == 0) {
                            message.error("anda melebihi batas pengiriman, maximum jarak pengiriman adalah " + data.data[0].max_distance + " km")
                            this.error.send.status = true
                            this.error.send.message = "anda melebihi batas pengiriman, maximum jarak pengiriman adalah " + data.data[0].max_distance + " km"
                            return
                        }
                        this.send_cost = data.data
                    })
                    .catch(() => {
                    });
            });
        },
        handleChange() {
            if (this.id.length == 0) {
                this.error.id.status = true
                this.error.id.message = "Nomor Permohonan harus diisi"
            } else {
                for (let i in this.id) {
                    if (this.id[i].length < 16) {
                        message.error("Nomor Permohonan yang anda masukkan salah")
                        this.id.splice(i, 1);
                        return
                    } else {
                        if (i == 0) {
                            this.kanim.code = this.id[i].substring(0, 3);
                            this.getKanim()
                        } else {
                            if (this.kanim.code != parseInt(this.id[i].substring(0, 3))) {
                                message.error("Nomor Permohonan yang anda masukkan berada di kanim yang berbeda")
                                this.id.splice(i, 1);
                                return
                            }
                        }
                    }
                }
            }
            this.error.id.status = false
            this.cost = 10000 * this.id.length
            this.id = [...new Set(this.id)];
            this.getPrice()
        },
        getKanim() {
            this.recaptcha().then((token) => {
                const requestOptions = {
                    method: "GET",
                    headers: { "Content-Type": "application/json", "c-tok": token },
                }
                customFetch(KANIM + "/" + this.kanim.code, requestOptions, this.$route.meta)
                    .then((data) => {
                        if (data == undefined) {
                            throw new Error("No data");
                        }
                        if (data.data == null || data.data.length == 0) {
                            message.error("Nomor Permohonan yang anda masukkan tidak ditemukan")
                            this.id = []
                            return
                        }
                        this.kanim = data.data[0]
                        this.forceRerender()
                    })
                    .catch(() => {
                    });
            });
        },
        async forceRerender() {
            this.maps_data.center = this.getCenterCoordinate(this.maps_data.markerPosition, { lat: this.kanim.lat, lng: this.kanim.lng })
            // Remove MyComponent from the DOM
            this.renderComponent = false;

            // Wait for the change to get flushed to the DOM
            await this.$nextTick();

            // Add the component back in
            this.renderComponent = true;
        },
        selectAddress(item, updateCoordinate = true) {
            this.place_id = item.place_id
            this.recaptcha().then((token) => {
                const requestOptions = {
                    method: "GET",
                    headers: { "Content-Type": "application/json", "c-tok": token },
                }
                customFetch(ADDRESS + '/detail?q=' + item.description, requestOptions, this.$route.meta)
                    .then((data) => {
                        if (data == undefined) {
                            throw new Error("No data");
                        }
                        let candidates = data.data.candidates
                        if (candidates.length > 0) {

                            if (updateCoordinate) {
                                this.maps_data.markerPosition.lat = candidates[0].geometry.location.lat;
                                this.maps_data.markerPosition.lng = candidates[0].geometry.location.lng;
                            }
                            this.forceRerender()
                        }
                        this.expand_maps = ['1']
                        this.fetching = false;
                        this.getPrice()
                    })
                    .catch(() => {
                        this.fetching = false;
                    });
            });

        },
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