<template>
    <QrcodeStream :constraints="getConstraints()" :track="trackFunctionSelected" @error="onError" @detect="onDetect"
        v-if="selectedDevice !== null && display">
    </QrcodeStream>
</template>
<script>
import { message } from "ant-design-vue";
import { QrcodeStream } from 'vue-qrcode-reader'

export default {
    name: 'QRCode',
    emits: ["addData"],
    components: { QrcodeStream },
    props: {
        display: Boolean
    },
    data() {
        return {
            selectedDevice: null,
            devices: null,
            trackFunctionSelected: null,
            trackFunctionOptions: [],
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
                message.error('MediaDevices API not available');
                this.$emit("addData", null)
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
                message.error('Error enumerating devices:', error);
                this.$emit("addData", null)
            }
        },
        add() {
            // Your code for handling the "Tambah" button click
            this.displayStream = true
        },
        onError(error) {
            // Your error handling code
            message.log(error)
            this.$emit("addData", null)
        },
        onDetect(data) {
            let val = data.map((code) => code.rawValue)
            if (Array.isArray(val) && val.length > 0) {
                this.$emit("addData", val[0])
                return
            }
            this.$emit("addData", null)

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