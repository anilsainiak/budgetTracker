export const Curriencies = [
    {value:'USD',label:'$ Dollar',locale:'en-US'},
    {value:'EUR',label:'€ Euro',locale:'de-DE'},
    {value:'GBP',label:'£ Pound',locale:'en-GB'},
    {value:'RUB',label:'₽ Ruble',locale:'ru-RU'},
    {value:'CNY',label:'¥ Chinese Yuan',locale:'zh-CN'},
    {value:'JPY',label:'¥ Japanese Yen',locale:'ja-JP'},
    {value:'INR',label:'₹ Indian Rupee',locale:'hi-IN'},
]

export type Currency = (typeof Curriencies)[0];

export const GetFormatterForCurrency=(currency:string)=>{
    const locale = Curriencies.find((c)=>c.value===currency)?.locale;
    return new Intl.NumberFormat(locale,{
        style:'currency',
        currency
    })
}