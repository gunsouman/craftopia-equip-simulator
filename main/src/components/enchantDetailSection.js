import React, {forwardRef}  from 'react';

import './enchantDetailSection.css';


export default  forwardRef((props, ref) => {
  let equip_parts = props["equip_parts"]
  
  return (

    <article className="enchantDetail">
      <div>
        <div className="title">エンチャント詳細</div>
        <table>
          <thead>
            <tr role="row">
              <th>装備箇所</th>
              <th>名称</th>
              <th>エンチャント</th>
            </tr>
          </thead>
          <tbody>
            {equip_parts.map((equip_part, i) => { 
              return(
                <tr key={i+"enchantDetail"}>
                  <td>{equip_part.title}</td>
                  <td className={(equip_part.target)?"equip_rarelity_"+equip_part.target["rarelity"]:""}>{equip_part.target && equip_part.target.name}</td>
                  <td>
                    {equip_part.enchantments &&
                      Object.keys(equip_part.enchantments).map((i) => {
                        let enchantment = equip_part.enchantments[i]
                        if(enchantment!=null){
                          return (<div key={i+"enchantDetail_get"}>
                            <span 
                              className={"enchant_rarelity_"+enchantment["rarelity"]}
                            >{enchantment.name}</span>
                            
                          ({enchantment["備考"].replace("lv.", "Lv")}
                          {(enchantment["備考"]!=="")&&(enchantment["ト"]==="○")&&"、 "}
                          {(enchantment["ト"]==="○")&&"トレジャー"}
                          )</div>)
                        }
                      })
                    }
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </article>
  )
})
