export default function getGreenPlansaledate(plansaledate){
    let greenPlansaledate = []
    if(plansaledate!=""){
      // 1. 按逗号分割字符串
      let arr = plansaledate.split(',');
      // 2. 将字符串数组转换为数字数组
      arr = arr.map(Number);
      // 3. 对数字数组进行升序排序
      arr.sort((a, b) => a - b);
      // 4. 将最小的以及前后两个月的销售季期存入数组
      let minplansaledate = arr[0].toString()
  
      const year = 2000 + parseInt(minplansaledate.substring(0,2));
      const month = parseInt(minplansaledate.substring(2)) - 1;
      const baseDate = new Date(year, month);
      
      for (let i = -2; i <= 2; i++) {
        const date = new Date(baseDate);
        date.setMonth(date.getMonth() + i);
  
        // 格式化为YYMM（自动处理跨年/跨月）
        const formattedYear = (date.getFullYear() - 2000).toString().padStart(2, '0');
        const formattedMonth = (date.getMonth() + 1).toString().padStart(2, '0');
        let final = formattedYear + formattedMonth
        greenPlansaledate.push(+final);
      }
    }
    console.log('绿色销售季期列表',greenPlansaledate,plansaledate);
    return greenPlansaledate
  }