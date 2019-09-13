<template>
  <div
    class="ez-otp-input"
  >
    <input
      v-for="i in length"
      :key="i"
      :ref="`otpInput${i}`"

      v-model="otpArray[i - 1]"

      class="ez-otp-input__field"
      type="number"

      :autofocus="i === 1"

      :placeholder="placeholder"
      :disabled="disable"

      @input="onInput($event, i)"
      @keydown.right.prevent="focusInputByRef(i + 1)"
      @keydown.left.prevent="focusInputByRef(i - 1)"
      @keydown.delete="onDelete($event, i)"
      @keydown.up.down.prevent

      @paste.prevent="onPaste"
    />
  </div>
</template>

<script>
export default {
  name: 'EzOtpInput',

  props: {
    value: {
      type: String
    },

    length: {
      type: Number,
      default: () => 4,
      validator: (v) => v > 0
    },

    disable: {
      type: Boolean,
      default: false
    },

    placeholder: {
      type: String,
      default: '--'
    },

    autoSubmit: {
      type: Boolean,
      default: true
    }
  },

  data () {
    return {
      otpArray: new Array(this.length),

      validRegex: /^[0-9]$/
    }
  },

  methods: {
    onInput (event, refKey) {
      if (!this.validRegex.test(event.data)) {
        event.target.value = ''
        this.$set(this.otpArray, refKey - 1, '')
        return
      }

      this.$set(this.otpArray, refKey - 1, event.data)

      if (refKey) {
        this.focusInputByRef(refKey + 1)
      }

      this.$emit('input', this.otpArray.join(''))
    },

    onDelete (event, refKey) {
      let val = event.target.value
      let hasValue = typeof val === 'string' && val.length > 0

      this.$set(this.otpArray, refKey - 1, '')

      if (refKey && !hasValue) {
        this.$set(this.otpArray, refKey - 2, '')
        this.focusInputByRef(refKey - 1)
      }

      this.$emit('input', this.otpArray.join(''))
    },

    onPaste (event) {
      const clipboardData =
        event.clipboardData ||
        window.clipboardData ||
        event.originalEvent.clipboardData

      const pastedData = clipboardData.getData('Text')
      const arrayOfNumbers = pastedData.split('')
        .filter(v => !isNaN(parseInt(v)))
        .slice(0, this.length)

      this.otpArray = arrayOfNumbers

      this.focusInputByRef(arrayOfNumbers.length < this.length ? arrayOfNumbers.length + 1 : this.length)
      this.$emit('input', this.otpArray.join(''))
    },

    focusInputByRef (refKey) {
      let ref = this.$refs[`otpInput${refKey}`]

      if (ref) {
        ref[0] && ref[0].focus()
      }
    }
  },

  watch: {
    value (to) {
      if (this.autoSubmit && to && to.length === this.length) {
        this.$emit('filled')
      }
    }
  }
}
</script>

<style scoped>
.ez-otp-input__field {
  width: 2em;
  height: 2em;
  text-align: center;
  border: none;
  transition: all 0.3s ease;
}

.ez-otp-input__field:not(:first-child) {
  margin-left: 0.5em;
}

.ez-otp-input__field:not(:last-child) {
  margin-right: 0.5em;
}

.ez-otp-input__field:focus {
  outline: none;
}

.ez-otp-input__field::-webkit-inner-spin-button,
.ez-otp-input__field::-webkit-outer-spin-button {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  margin: 0;
}
</style>
