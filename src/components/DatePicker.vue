<template>
  <section class="wh_container">
    <div class="wh_content_all">
      <div class="wh_top_changge">
        <li @click="PreMonth()">
          <div class="wh_jiantou1"></div>
        </li>
        <li class="wh_content_li">{{dateTop}}</li>
        <li @click="NextMonth()">
          <div class="wh_jiantou2"></div>
        </li>
      </div>
      <div class="wh_content">
        <div class="wh_content_item" v-for="(tag, index) in textTop" :key="index">
          <div>
            {{tag}}
          </div>
        </div>
      </div>
      <div class="wh_content">
        <div class="wh_content_item" v-for="(item,index) in list" :key="index" @click="clickDay(item,index)">
          <div>
            <li v-if="(isHideOtherday&&item.nextDayShow)||item.otherMonth||item.dayHide" class="wh_nextDayShow"
                v-bind:class="[{isToday_now:item.isTodayNow},getClass(item)]">
              {{item.id}}
            </li>
            <li v-else
                v-bind:class="[{ wh_isToday: item.isToday,wh_isMark:item.isMark,isTodayNow:item.isTodayNow},getClass(item)]">
              {{item.id}}
            </li>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  name: 'date-picker',
  data() {
    return {
      textTop: ['一', '二', '三', '四', '五', '六', '日'],
      myData: [],
      list: [],
      dateTop: '',
      chooseDates: []
    }
  },
  props: {
    markArray: {default: '[]'},
    markDate: {default: '[]'},
    markDateMore: {default: '[]'},
    agoDayHide: {default: '0'},
    futureDayHide: {default: '15181550670000'},
    isHideOtherday: {default: false}
  },
  created() {
    this.myData = new Date()
  },
  methods: {
    getClass(data) {
      let obj = {}
      obj[data.markClassName] = data.markClassName
      return obj
    },
    clickDay (item, index) {
      if (item.otherMonth) {
        item.otherMonth < 0 ? this.PreMonth(item.date) : this.NextMonth(item.date)
      } else {
        item.isToday = !item.isToday
        if (item.isToday){
          this.chooseDates = [...this.chooseDates, item.date]
        } else {
          this.chooseDates.splice(this.chooseDates.indexOf(item.date), 1)
        }
      }
      this.$emit('change', this.chooseDates)
    },
    ChoseMonth (date, isChosedDay = true) {
      date = this.dateFormat(date)
      this.myData = new Date(date)
      this.$emit('changeMonth', this.dateFormat(this.myData))
      this.getList(this.myData, date, isChosedDay)
    },
    PreMonth (date, isChosedDay = true) {
      date = this.dateFormat(date)
      this.myData = this.getPreMonth(this.myData)
      this.$emit('changeMonth', this.dateFormat(this.myData))
      this.getList(this.myData, date, isChosedDay)
    },
    NextMonth (date, isChosedDay = true) {
      date = this.dateFormat(date)
      this.myData = this.getNextMonth(this.myData)
      this.$emit('changeMonth', this.dateFormat(this.myData))
      this.getList(this.myData, date, isChosedDay)
    },
    getPreMonth (date) {
      let timeArray = this.dateFormat(date).split('/')
      let year = timeArray[0]
      let month = timeArray[1]
      let day = timeArray[2]
      // let days = new Date(year, month, 0)
      // days = days.getDate()
      let year2 = year
      let month2 = parseInt(month) - 1
      if (month2 === 0) {
        year2 = parseInt(year2) - 1
        month2 = 12
      }
      let day2 = day
      let days2 = new Date(year2, month2, 0)
      days2 = days2.getDate()
      if (day2 > days2) {
        day2 = days2
      }
      if (month2 < 10) {
        month2 = '0' + month2
      }
      if (day2 < 10) {
        day2 = '0' + day2
      }
      let t2 = year2 + '/' + month2 + '/' + day2
      return new Date(t2)
    },
    getNextMonth (date) {
      let arr = this.dateFormat(date).split('/')
      let year = arr[0] // 获取当前日期的年份
      let month = arr[1] // 获取当前日期的月份
      let day = arr[2] // 获取当前日期的日
      // let days = new Date(year, month, 0)
      // days = days.getDate() // 获取当前日期中的月的天数
      let year2 = year
      let month2 = parseInt(month) + 1
      if (month2 === 13) {
        year2 = parseInt(year2) + 1
        month2 = 1
      }
      let day2 = day
      let days2 = new Date(year2, month2, 0)
      days2 = days2.getDate()
      if (day2 > days2) {
        day2 = days2
      }
      if (month2 < 10) {
        month2 = '0' + month2
      }
      if (day2 < 10) {
        day2 = '0' + day2
      }
      let t2 = year2 + '/' + month2 + '/' + day2
      return new Date(t2)
    },
    getDaysInOneMonth (date) { // 天数
      let getyear = date.getFullYear()
      let getmonth = date.getMonth() + 1
      getmonth = parseInt(getmonth, 10)
      let d = new Date(getyear, getmonth, 0)
      return d.getDate()
    },
    getMonthweek (date) {
      let getyear = date.getFullYear()
      let getmonth = date.getMonth() + 1
      let dateOne = new Date(getyear + '/' + getmonth + '/1')
      return dateOne.getDay() === 0 ? 6 : dateOne.getDay() - 1
    },
    getList (date, chooseDay, isChosedDay = true) {
      let mygetMonth = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      this.dateTop = date.getFullYear() + '年' + mygetMonth + '月'
      let array = []
      const today = new Date()
      const todayTime = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate()
      for (let i = 0; i < this.getDaysInOneMonth(date); i++) {
        let nowTime = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + (i + 1)
        let markClassName = ''
        for (const k of this.markDateMore) {
          if (k.date === nowTime) {
            markClassName = k.className
          }
        }
        array = array.concat({
          id: i + 1,
          date: nowTime,
          showToday: '',
          isTodayNow: todayTime === nowTime,
          isToday: this.chooseDates.indexOf(nowTime) !== -1 && isChosedDay,
          isMark: this.markArray.indexOf(i + 1) >= 0 || this.markDate.indexOf(nowTime) >= 0,
          dayHide: new Date(nowTime).getTime() < parseInt(this.agoDayHide) || new Date(nowTime).getTime() > parseInt(this.futureDayHide),
          markClassName: markClassName,
          nextDayShow:
          new Date(nowTime).getTime() >
          new Date().getTime()
        })
      }
      let array2 = []
      let num = this.getDaysInOneMonth(this.getPreMonth(date)) - this.getMonthweek(date) + 1
      let preDate = this.getPreMonth(date)
      let nextDate = this.getNextMonth(date)
      // 上个月多少开始
      for (let i = 0; i < this.getMonthweek(date); i++) {
        let nowTime = preDate.getFullYear() + '/' + (preDate.getMonth() + 1) + '/' + (num + i)
        array2 = array2.concat(
          {
            id: num + i,
            date: nowTime,
            dayHide: new Date(nowTime).getTime() < parseInt(this.agoDayHide) || new Date(nowTime).getTime() > parseInt(this.futureDayHide),
            nextDayShow:
            new Date(nowTime).getTime() >
            new Date().getTime(),
            otherMonth: -1
          })
      }
      array = array2.concat(array)
      let _length = 7 - array.length % 7
      if (_length < 7) {
        for (let i = 0; i < _length; i++) {
          let nowTime = nextDate.getFullYear() + '/' + (nextDate.getMonth() + 1) + '/' + (i + 1)
          array.push({
            id: i + 1,
            date: nextDate.getFullYear() + '/' + (nextDate.getMonth() + 1) + '/' + (i + 1),
            dayHide: new Date(nowTime).getTime() < parseInt(this.agoDayHide) || new Date(nowTime).getTime() > parseInt(this.futureDayHide),
            nextDayShow:
            new Date(nowTime).getTime() >
            new Date().getTime(),
            otherMonth: 1
          })
        }
      }
      this.list = array
    },
    dateFormat (date) {
      date = new Date(date)
      return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()
    },
    clearChooseDates(){
      this.chooseDates = []
      this.myData = new Date()
      this.list = []
      this.getList(this.myData)
    }
  },
  mounted() {
    this.getList(this.myData)
  },
  watch: {
    markArray(val, oldVal) {
      this.getList(this.myData)
    },
    markDate(val, oldVal) {
      this.getList(this.myData)
    },
    markDateMore(val, oldVal) {
      this.getList(this.myData)
    }
  }
}
</script>
<style>
  * {
    margin: 0;
    padding: 0;
  }

  .wh_container {
    max-width: 410px;
    margin: auto;
  }

  li {
    list-style-type: none;
  }

  .wh_content_all {
    font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', STHeiti, 'Microsoft Yahei', Tahoma,
    Simsun, sans-serif;
    background-color: #fff;
    width: 100%;
    overflow: hidden;
    padding-bottom: 8px;
  }

  .wh_content {
    display: flex;
    flex-wrap: wrap;
    padding: 0 3% 0 3%;
    width: 100%;
  }

  .wh_content:first-child .wh_content_item {
    color: #ddd;
    font-size: 16px;
    height: 15%;
    line-height: 15%;
  }

  .wh_content_item {
    font-size: 15px;
    width: 13.4%;
    padding-bottom: 10.14%;
    text-align: center;
    color: #111;
    position: relative;
  }

  .wh_content_item div {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .wh_content_item li {
    width: 37px;
    height: 37px;
    border-radius: 100px;
    line-height: 37px;
  }

  @media screen and (min-width: 460px) {
    .wh_content_item li:hover {
      background: #fff;
      cursor: pointer
    }
  }

  .wh_top_changge {
    display: flex;
  }

  .wh_top_changge li {
    cursor: pointer;
    display: flex;
    color: #111;
    font-size: 18px;
    flex: 1;
    justify-content: center;
    align-items: center;
    height: 47px;
  }

  .wh_top_changge .wh_content_li {
    cursor: auto;
    flex: 2.5;
  }

  .wh_jiantou1 {
    width: 12px;
    height: 12px;
    border-top: 2px solid #111;
    border-left: 2px solid #111;
    transform: rotate(-45deg);
  }

  .wh_jiantou1:active,
  .wh_jiantou2:active {
    border-color: #ddd;
  }

  .wh_content_item div .wh_isToday {
    margin: auto;
    background-color: #eee !important;
    color: #278cff;
    border-radius: 100px;
    text-align: center;
  }

  .wh_content_item div .isTodayNow{
    margin: auto;
    color: #42a8ff;
    background-color: #fff;
    border-radius: 100px;
    text-align: center;
    border: 1px solid #e9e9e9;
    line-height: 36px;
  }

  .wh_jiantou2 {
    width: 12px;
    height: 12px;
    border-top: 2px solid #111;
    border-right: 2px solid #111;
    transform: rotate(45deg);
  }

  .wh_content_item div .wh_isMark {
    margin: auto;
    border-radius: 100px;
    border: 1px solid blue;
    z-index: 2;
  }

  .wh_content_item div .wh_nextDayShow {
    color: #bfbfbf;
  }
</style>
