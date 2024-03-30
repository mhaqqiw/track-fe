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
    <div class="qcard">
        Coba QR Code
        <label>QR CODE Value: {{ txt }}</label>
        <a-button @click="tambah">Tambah</a-button>
        <QrcodeStream :constraints="getConstraints()" :track="trackFunctionSelected" @error="onError" @detect="onDetect"
            v-if="selectedDevice !== null">
        </QrcodeStream>
    </div>
</template>

<script>
import { QrcodeStream } from 'vue-qrcode-reader'

export default {
    name: 'FormPayment',
    components: { QrcodeStream },
    emits: ["changeStep"],
    data() {
        return {
            selectedDevice: null,
            devices: null,
            txt: null,
            trackFunctionSelected: null,
            trackFunctionOptions: []
        }
    },
    async mounted() {
        await this.getDevice()
        this.trackFunctionOptions = [
            { text: 'nothing (default)', value: undefined },
            { text: 'outline', value: this.paintOutline },
            { text: 'centered text', value: this.paintCenterText },
            { text: 'bounding box', value: this.paintBoundingBox }
        ]
        this.trackFunctionSelected = this.trackFunctionOptions[1].value
    },
    methods: {
        back() {
            this.$emit("changeStep", 2);
        },
        async getDevice() {
            if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
                // Handle case where mediaDevices or enumerateDevices is not available
                console.error('MediaDevices API not available');
                return;
            }

            try {
                this.devices = await navigator.mediaDevices.enumerateDevices();
                this.devices = this.devices.filter(({ kind }) => kind === 'videoinput');

                if (this.devices.length > 0) {
                    this.selectedDevice = this.devices[0];
                }
            } catch (error) {
                // Handle any errors that might occur during enumeration
                console.error('Error enumerating devices:', error);
            }
        },
        tambah() {
            // Your code for handling the "Tambah" button click
        },
        onError(error) {
            // Your error handling code
            console.log(error)
        },
        onDetect(data) {
            this.txt = JSON.stringify(data.map((code) => code.rawValue))

            // Your code for handling detected QR codes
        },
        paintOutline(detectedCodes, ctx) {
            for (const detectedCode of detectedCodes) {
                const [firstPoint, ...otherPoints] = detectedCode.cornerPoints

                ctx.strokeStyle = 'red'

                ctx.beginPath()
                ctx.moveTo(firstPoint.x, firstPoint.y)
                for (const { x, y } of otherPoints) {
                    ctx.lineTo(x, y)
                }
                ctx.lineTo(firstPoint.x, firstPoint.y)
                ctx.closePath()
                ctx.stroke()
            }
        },
        paintBoundingBox(detectedCodes, ctx) {
            for (const detectedCode of detectedCodes) {
                const {
                    boundingBox: { x, y, width, height }
                } = detectedCode

                ctx.lineWidth = 2
                ctx.strokeStyle = '#007bff'
                ctx.strokeRect(x, y, width, height)
            }
        },
        paintCenterText(detectedCodes, ctx) {
            for (const detectedCode of detectedCodes) {
                const { boundingBox, rawValue } = detectedCode

                const centerX = boundingBox.x + boundingBox.width / 2
                const centerY = boundingBox.y + boundingBox.height / 2

                const fontSize = Math.max(12, (50 * boundingBox.width) / ctx.canvas.width)

                ctx.font = `bold ${fontSize}px sans-serif`
                ctx.textAlign = 'center'

                ctx.lineWidth = 3
                ctx.strokeStyle = '#35495e'
                ctx.strokeText(detectedCode.rawValue, centerX, centerY)

                ctx.fillStyle = '#5cb984'
                ctx.fillText(rawValue, centerX, centerY)
            }
        },
        getConstraints() {
            if (this.isMobileDevice()) {
                return {
                    facingMode: "environment" // Use the rear camera on mobile devices
                };
            } else {
                return {
                    deviceId: this.selectedDevice.deviceId
                };
            }
        },
        isMobileDevice() {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        }
    }
}
</script>
