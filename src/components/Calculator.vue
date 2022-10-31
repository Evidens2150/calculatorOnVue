<template>
  <div class="container">
    <h1 class="hidden">
      {{ 'The Calculator' }}
    </h1>
    <div class="wrapper">
      <div class="content">
        <div
          class="display"
          :class="{ 'reverse-order': result }"
          @click="setInputFocus"
        >
          <input
            ref="input"
            v-model="originString"
            :disabled="isInputDisabled"
            class="input"
            type="text"
            @input="handleInput($event)"
          >
          <div
            class="result-block"
            :class="{ 'error': isError }"
          >
            {{ result }}
          </div>
        </div>
        <div class="buttons">
          <round-button
            v-for="button in buttons"
            :key="button"
            :is-white="button === '='"
            @clicked="handleButtonClick(button)"
          >
            <template v-slot:content>
              <multiplication-operator-icon
                v-if="button === '*'"
                :size="isSmallMobile ? '13' : '16'"
              />
              <span v-else>
                {{ button }}
              </span>
            </template>
          </round-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MultiplicationOperatorIcon from '../assets/icons/MultiplicationOperatorIcon'
import RoundButton from './RoundButton'

export default {
  name: 'TheCalculator',
  components: {
    RoundButton,
    MultiplicationOperatorIcon
  },
  data () {
    return {
      windowWidth: 0,
      buttons: [
        'C',
        '√',
        '%',
        '/',
        '7',
        '8',
        '9',
        '*',
        '4',
        '5',
        '6',
        '-',
        '1',
        '2',
        '3',
        '+',
        '00',
        '0',
        ',',
        '='
      ],
      operators: [
        '/',
        '*',
        '-',
        '+'
      ],
      priorityOperators: [
        '/',
        '*'
      ],
      currentNumberAsString: '',
      originString: '√(94+2*5*50%)/√4*√(141+√9)%',
      calculatingString: '',
      result: '',
      isSimpleRoot: false,
      isComplexRoot: false,
      simpleStringIntoRoot: '',
      complexStringIntoRoot: '',
      isOperator: false,
      isError: false
    }
  },
  computed: {
    isInputDisabled () {
      return !!this.result
    },
    isIntoRoot () {
      return this.isSimpleRoot || this.isComplexRoot
    },
    isStringIntoRoot () {
      return !!this.simpleStringIntoRoot || !!this.complexStringIntoRoot
    },
    isSmallMobile () {
      return this.windowWidth && this.windowWidth <= 375
    }
  },
  created () {
    this.updateWidth()
    this.initListeners()
  },
  beforeUnmount () {
    this.removeListeners()
  },
  methods: {
    showRulesUse () {
      console.log('$$$$$$')
    },
    initListeners () {
      window.addEventListener('resize', this.updateWidth)
      window.addEventListener('keyup', this.handleKeyup)
    },
    removeListeners () {
      window.removeEventListener('resize', this.updateWidth)
      window.removeEventListener('keyup', this.handleKeyup)
    },
    handleKeyup (event) {
      if (event.key == 'Enter') {
        this.equal()
      }
      if (event.key == 'Escape') {
        this.clear(true)
      }
    },
    updateWidth () {
      if (typeof window === 'undefined') return
      this.windowWidth = window.innerWidth;
    },
    setInputFocus () {
      if (!this.$refs.input || this.isInputDisabled) return
      this.$refs.input.focus()
    },
    handleInput (e) {
      if (!e.target || !e.target || !e.target.value) {
        this.clear(true)
        return
      }
      e.target.value = e.target.value.replace('.', ',')
      e.target.value = e.target.value.replace(/[^0-9√/*,+%()-\.]/g, '')
      if (e.target.value === '-') return
      if (this.operators.includes(e.target.value)) {
        e.target.value = ''
      }
      if (!e.target.value) {
        this.clear(true)
        return
      }
      this.currentNumberAsString = this.getLastArgumentByString()
    },
    getLastArgumentByString () {
      const originStringAtArray = []
      for (let char of this.originString) {
        originStringAtArray.push(char)
      }
      const reverseOriginStringAtArray = originStringAtArray.reverse()
      const indexOfLastOperator = reverseOriginStringAtArray.indexOf(reverseOriginStringAtArray.find(char => this.operators.includes(char)))
      const lastArgumentAtArray = reverseOriginStringAtArray.slice(0, indexOfLastOperator).reverse()
      const lastArgument = lastArgumentAtArray.join('').replace('(', '').replace(')', '').replace('%', '').replace('√', '')
      return lastArgument
    },
    isOperatorActiveLast () {
      if (!this.originString) return false
      const lastSymbol = this.originString.slice(this.originString.length - 1)
      return this.operators.includes(lastSymbol)
    },
    calculatingByString (string) {
      var result
      try {
        result = (new Function('return ' + string))()
      } catch {
        result = 'Выражение содержит ошибку'
        this.isError = true
      } finally {
        return result
      }
    },
    handleButtonClick (button) {
      this.isOperator = this.operators.includes(button)
      if (button === 'C') {
        this.clear(true)
        return
      }
      if (button === '=') {
        this.equal()
        return
      }
      if (button === '√' && this.currentNumberAsString) return
      if (button === '%' && !this.currentNumberAsString) return
      if (button === '-' && !this.currentNumberAsString && !this.originString) {
        this.originString += '-'
        this.calculatingString += '-'
        this.currentNumberAsString += '-'
        return
      }
      if (button === '+' && this.originString === '-') {
        this.originString = ''
        this.calculatingString = ''
        this.currentNumberAsString = ''
        return
      }
      this.append(button)
    },
    clear (isFull = false) {
      this.currentNumberAsString = ''
      this.isSimpleRoot = false
      this.isComplexRoot = false
      this.simpleStringIntoRoot = ''
      this.complexStringIntoRoot = ''
      this.isOperator = false
      if (isFull) {
        this.originString = ''
        this.calculatingString = ''
        this.result = ''
        this.isError = false
      }
      this.setInputFocus()
    },
    squareRoot (value) {
      if (!value) return
      const result = Math.sqrt(value)
      return result
    },
    percent (coefficient, value) {
      if (!coefficient) return
      if (!value) {
        return parseFloat(coefficient) / 100
      }
      const onePercent = parseFloat(value) / 100
      return parseFloat(coefficient) * onePercent
    },
    calculatePercentByExpression (originString) {
      const originStringAtArray = []
      for (let char of originString) {
        originStringAtArray.push(char)
      }
      const argumentsOfOriginString = originStringAtArray.filter(el => !this.operators.includes(el)).reverse()
      const operatorsOfOriginString = originStringAtArray.filter(el => this.operators.includes(el)).reverse()
      const lastOperator = operatorsOfOriginString.length ? operatorsOfOriginString[0] : null
      if (!lastOperator || !this.priorityOperators.includes(lastOperator)) {
        return this.percent(this.currentNumberAsString, this.calculatingByString(originString))
      }
      const arrayForCalculatingPercent = [argumentsOfOriginString[0]]
      let index = 0
      for (let el of operatorsOfOriginString) {
        index++
        if (this.priorityOperators.includes(el)) {
          arrayForCalculatingPercent.push(el)
          arrayForCalculatingPercent.push(argumentsOfOriginString[index])
        } else {
          break
        }
      }
      const preparedString = arrayForCalculatingPercent.reverse().join('')
      return this.percent(this.currentNumberAsString, this.calculatingByString(preparedString))
    },
    calulatePercent (isSimple) {
      let currentCalculatingString = this.isSimpleRoot && isSimple ? this.simpleStringIntoRoot : this.isComplexRoot ? this.complexStringIntoRoot : this.calculatingString
      while (this.isStringIntoRoot && currentCalculatingString.includes('stringIntoRoot')) {
        this.replaceSquareRootWithValue()
        currentCalculatingString = this.isSimpleRoot && isSimple ? this.simpleStringIntoRoot : this.isComplexRoot ? this.complexStringIntoRoot : this.calculatingString
      }
      const slicingLengthForCalc = this.currentNumberAsString.length + 1
      const slicingLengthForResult = this.currentNumberAsString.length
      const calculatingStringStart = currentCalculatingString.slice(0, -slicingLengthForResult)
      const preparedString = currentCalculatingString.slice(0, -slicingLengthForCalc).replace('(', '').replace(')', '')
      const percentValue = this.percent(this.currentNumberAsString, this.calculatingByString(preparedString))
      if (this.isSimpleRoot && isSimple) {
        this.simpleStringIntoRoot = calculatingStringStart + percentValue
        return
      }
      const currentOperation = currentCalculatingString.slice(-slicingLengthForCalc, -slicingLengthForResult)
      const isPriorityOperationBeforePercentValue = this.priorityOperators.includes(currentOperation)
      const percentValueByExpression = isPriorityOperationBeforePercentValue ? this.calculatePercentByExpression(preparedString) : percentValue
      if (this.isComplexRoot) {
        this.complexStringIntoRoot = calculatingStringStart + percentValueByExpression
        return
      }
      this.calculatingString = calculatingStringStart + percentValueByExpression
    },
    equal () {
      if (!this.originString) return
      this.currentNumberAsString = ''
      let index = 0
      for (let char of this.originString) {
        index++
        if (this.operators.includes(char)) {
          this.currentNumberAsString = ''
        } else {
          this.currentNumberAsString += char
          this.currentNumberAsString = this.currentNumberAsString.replace('(', '').replace(')', '').replace('%', '').replace('√', '')
        }
        if (char === '%') {
          const isSimple = !this.isComplexRoot && this.originString[index - 2] !== ')'
          this.calulatePercent(isSimple)
          continue
        }
        if (char === '√') {
          this.isSimpleRoot = true
          continue
        }
        if (char === '(' && this.originString[index - 2] === '√') {
          this.isSimpleRoot = false
          this.isComplexRoot = true
        }
        if (this.operators.includes(char) && this.isSimpleRoot) {
          this.isSimpleRoot = false
        }
        if (char === ')' && this.isIntoRoot) {
          this.isComplexRoot = false
        }
        if (this.isComplexRoot && !this.isSimpleRoot) {
          this.complexStringIntoRoot += char
        }
        if (this.isSimpleRoot) {
          this.simpleStringIntoRoot += char
        }
        if ((this.isSimpleRoot || this.isComplexRoot) && !this.calculatingString.includes('stringIntoRoot')) {
          this.calculatingString += 'stringIntoRoot'
          continue
        }
        if (this.isSimpleRoot && this.isComplexRoot && !this.complexStringIntoRoot.includes('stringIntoRoot')) {
          this.complexStringIntoRoot += 'stringIntoRoot'
          continue
        }
        if (this.isIntoRoot || (char === ')')) continue
        while (this.isStringIntoRoot) {
          this.replaceSquareRootWithValue()
        }
        if (char === ')') {
          const length = this.calculatingString.slice(0, this.calculatingString.indexOf('(')).length
          const valueForReplace = this.calculatingByString(this.calculatingString.slice(length + 1))
          this.currentNumberAsString = valueForReplace + ''
          this.calculatingString = this.calculatingString.slice(0, length) + valueForReplace
          continue
        }
        const symbol = char === ',' ? '.' : char
        this.calculatingString += symbol
      }
      while (this.isStringIntoRoot) {
        this.replaceSquareRootWithValue()
      }
      const originResult = this.calculatingByString(this.calculatingString)
      const preparedResult = (Math.ceil((originResult) * 100) / 100) + ''
      this.result = preparedResult.replace('.', ',')
      console.log('calculatingString: ', this.calculatingString)
      this.clear()
    },
    replaceSquareRootWithValue () {
      const stringIntoRoot = this.simpleStringIntoRoot || this.complexStringIntoRoot
      const preparedStringIntoRoot = stringIntoRoot.replace('(', '').replace(')', '')
      const stringIntoRootValue = this.squareRoot(this.calculatingByString(preparedStringIntoRoot))
      this.currentNumberAsString = stringIntoRootValue + ''
      if (this.simpleStringIntoRoot && this.complexStringIntoRoot) {
        this.simpleStringIntoRoot = ''
        this.complexStringIntoRoot = this.complexStringIntoRoot.replace('stringIntoRoot', stringIntoRootValue)
        return
      }
      this.simpleStringIntoRoot = ''
      this.complexStringIntoRoot = ''
      this.calculatingString = this.calculatingString.replace('stringIntoRoot', stringIntoRootValue)
    },
    append (label) {
      if (this.isInputDisabled) return
      const isZero = label === '00' || label === '0'
      if (isZero && !this.currentNumberAsString) {
        this.currentNumberAsString += '0,'
        this.originString += '0,'
        return
      }
      const value = label === '.' ? ',' : label
      if (label === '√') {
        this.originString += value
        return
      }
      if (label !== ',') {
        this.currentNumberAsString = this.isOperator ? '' : this.currentNumberAsString + value
        const preparedOriginString = this.isOperatorActiveLast() && this.isOperator ? this.originString.slice(0, this.originString.length - 1) : this.originString
        this.originString = preparedOriginString + value
        return
      }
      if (this.currentNumberAsString.indexOf(',') !== -1) return
      if (!this.currentNumberAsString) {
        this.currentNumberAsString += '0,'
        this.originString += '0,'
        return
      }
      this.currentNumberAsString += value
      this.originString += value
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../common.scss";

.hidden {
  display: none;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(122.76deg, #ffa2a2 4.09%, #ff7b7b 91.04%), #ffffff;
}

.wrapper {
  box-sizing: border-box;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 18px;
  padding: 38px 31px;
  width: 100%;
  max-width: 616px;
}

.content {
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: linear-gradient(155.23deg, #28518e 0%, #3a77d1 100%);
  box-shadow: 0px 82px 158px rgba(0, 0, 0, 0.35),
    0px 24.7206px 47.6324px rgba(0, 0, 0, 0.228056),
    0px 10.2677px 19.7841px rgba(0, 0, 0, 0.175),
    0px 3.71362px 7.1555px rgba(0, 0, 0, 0.121944);
  border-radius: 18px;
  color: #F2F2F2;
  font-weight: 500;
  padding: 47px;
}

.display {
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: column;
  border-bottom: 2px solid rgba(#FFFFFF, 0.2);
  padding: 25px 0;
  margin-bottom: 16px;
}

.input {
  order: 2;
  background-color: transparent;
  color: #F2F2F2;
  border: none;
  outline: none;
  font-weight: 500;
  font-size: 24px;
  line-height: 32px;
  font-family: "Geometria";
  text-align: end;
}

.result-block {
  height: 80px;
  order: 1;
  text-align: end;
  font-weight: 700;
  font-size: 56px;
  line-height: 80px;
}

.reverse-order {
  .input {
    order: 1;
  }

  .result-block {
    order: 2;
  }
}

.error {
  color: #ff7b7b;
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  box-sizing: border-box;
}

@include media(0, $media_mobile) {
  .wrapper {
    padding: 28px 21px;
  }

  .content {
    padding: 26px;
  }

  .display {
    padding: 15px 0;
    margin-bottom: 8px;
  }

  .input {
    font-size: 14px;
    line-height: 22px;
  }

  .result-block {
    height: 60px;
    font-size: 36px;
    line-height: 60px;
  }
}

@include media(0, $media_mobile-small) {
  .wrapper {
    padding: 18px 11px;
  }

  .content {
    padding: 16px;
  }
}
</style>
