import React, {forwardRef, useImperativeHandle, useEffect}  from 'react';
import { sortBy } from "lodash-es";
import "./enchantTable.css"

import Config from '../configs/configs.json'; // 追加
const ENCHANTMENT_COLUMNS = Config.ENCHANTMENT_COLUMNS
const TABLE_LIMIT = Config.TABLE_LIMIT
const RARELITY_INFOS = Config.RARELITY_INFOS

export default  forwardRef((props, ref) => {
  let originEnchants = props["data"]
  let [filterdEnchants, setFilterdEnchants] = React.useState(originEnchants)
  let [enchants, setEnchants] = React.useState(originEnchants.slice(0, TABLE_LIMIT));
  let [sortStatus, setSortStatus] = React.useState({column:null, type:null});
  let [marginTop, setMarginTop] = React.useState(-window.scrollY);
  let [targetEnchant, setTargetEnchant] = React.useState(null);

  // console.log("EnchantTable!!!!", filterdEnchants, enchants, props, ref)
  

  const selectEnchant = (e, row) => {
    // console.log("Table selectEnchant", e, props["id"], row, props)
    //親
    props["parent"].selectEnchant(props["id"], row);
    props["parent"].closeEnchantModal();
  }

  const changeSorting = (column) =>{
    setSortStatus({column: column, type: sortStatus["type"]==="asc"? "desc": "asc"})
    
    let _filterdEnchants;
    if (sortStatus["type"]==="asc"){
      _filterdEnchants = sortBy(originEnchants, column)
    }else{
      _filterdEnchants = sortBy(originEnchants, column).reverse()
    }
    
    setFilterdEnchants(_filterdEnchants)
    let new_enchants = _filterdEnchants.slice(0, TABLE_LIMIT)
    setEnchants(new_enchants)
    // console.log("sortStatus", sortStatus)
  }
  
  const trackScrolling = (e) => {
    // console.log(e, e.target.scrollTop, e.target.offsetHeight, e.target.scrollHeight)
    if(e.target.scrollHeight < e.target.scrollTop + e.target.offsetHeight){
      // console.log("filterdEnchants", filterdEnchants)
      setEnchants(enchants.concat(filterdEnchants.slice(enchants.length, enchants.length+TABLE_LIMIT)))
      // console.log("bottom", e, enchants)
    }
  };

  useEffect(() => {
  });

  // The component instance will be extended
  // with whatever you return from the callback passed
  // as the second argument
  useImperativeHandle(ref, () => ({
    updateEquipList(equip_list) {
      setEnchants(equip_list);
    }
  }));
	
  let sectionDom = null;
  let tbodyDom = null;

  const mouseMove = (e) => {
    let elements = [].slice.call( e.target.closest("tbody").children ) ;

    let index = elements.indexOf( e.target.closest("tr") )-1;
    
    setTargetEnchant(enchants[index])

    if(tbodyDom==null){
      sectionDom = document.querySelector('.enchantTableSection');
      tbodyDom = sectionDom.querySelector('.balloon');
    }
    
    tbodyDom.style.left = window.scrollX - sectionDom.offsetLeft + sectionDom.scrollLeft + e.clientX + 25 + "px";
    tbodyDom.style.top = - sectionDom.offsetTop + sectionDom.scrollTop + e.clientY - 7 + "px";
    
  }

  const dom = (
    <section className="enchantTableSection modalTable" onScroll={trackScrolling} style={{marginTop:marginTop}}>
      <table className="enchantTable">
        <thead>
          <tr>
            {ENCHANTMENT_COLUMNS.map(column => (
              <th key={column["accessor"]+"_enchantTable"} onClick={(e)=>{changeSorting(column['accessor'])}}>
                {column['Header']}
                <span>{sortStatus["column"]===column['accessor'] ? (sortStatus["type"]==="asc" ? ' ▼' : ' ▲') : ' 　'}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody onMouseMove={(e)=>{mouseMove(e)}} onMouseIn={(e)=>{mouseMove(e)}}>
          <span className="balloon">
            {
              (function () {
                let datas = ENCHANTMENT_COLUMNS.map((column) => {
                  let key = column["accessor"]
                  if(targetEnchant!=null && Object.keys(targetEnchant).indexOf(key)!==-1 
                    && targetEnchant[key]!==0
                    && key!=="name"
                  ){
                    let value = targetEnchant[key]
                    return <div key={column["accessor"]+"_balloon"}>{column["Header"]}: {value}</div>
                  }else{
                    return 0;
                  }
                })

                datas = datas.filter((n) => { return n !== undefined });

                if(datas.length===0){
                  datas.push(<div>(なし)</div>)
                }

                return datas
              }())
            }
          </span>
          {enchants.map(enchant => {
            let selected = false;
            for(let targetEnchant of props["parent"].equip_part.enchantments){
              if(targetEnchant!=null && enchant["name"]===targetEnchant["name"]){
                selected = true;
              }
              
            }

            let row = (
              <tr
                className={selected?"selected":""}
                onClick={(e) => selectEnchant(e, enchant)}
              >
                {ENCHANTMENT_COLUMNS.map((column, i) => (
                  <td key={column["accessor"]+"_enchant_row"}
                    style={{color:(column.accessor==="name")?RARELITY_INFOS[enchant["rarelity"]].color:""}}
                  >
                    {enchant[column.accessor]}
                  </td>
                ))}
              </tr>
            )
            return row
          })}
        </tbody>
      </table>
    </section>
  );

  return dom
});

