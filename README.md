## Install
```
npm i ez-otp-input --save
```
or
```
yarn add ez-otp-input
```

## Usage
### Vue.use()
```javascript
// Introduced in vue file
import EzOtpInput from 'ez-otp-input';
Vue.use(EzOtpInput);
```

### Import Component
```javascript
// Introduced in vue file
import { EzOtpInput } from 'ez-otp-input';

export default {
  name: 'MyComponent',
  ...
  components: {
    EzOtpInput
  }
}
```

### Props
| Props | Type | Default | Description |
| ----- | ---- | ------- | ----------- |
| `value` | `String` | &nbsp; | use `v-model` to automatically set your local value |
| `length` | `Number` | 4 | sets the length of the OTP |
| `disable` | `Boolean` | false | disables the input |
| `placeholder` | `String` | `--` | placeholder for each character input |
| `autoSubmit` | `Boolean` | true | flag to trigger `@filled` event when model is equal to `length` |

### Events
| Event | Param | Description |
| ----- | ----- | ----------- |
| `filled` | &nbsp; | triggered when all input fields are filled up. Can be enabled/disabled via the `autoSubmit` prop |
