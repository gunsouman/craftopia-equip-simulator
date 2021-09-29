import "./equipTable.css"

import React, {forwardRef, useImperativeHandle}  from 'react';
import { sortBy } from "lodash-es";

import Config from '../configs/configs.json'; // 追加
const items = require('../assets/item_infos/item.json');

const EQUIP_COLUMNS = Config.EQUIP_COLUMNS
const TABLE_LIMIT = Config.TABLE_LIMIT


export default forwardRef((props, ref) => {
  // console.log("EquipTable", EQUIP_COLUMNS, props["data"]);

  let originEquips = props["data"]
  let [filterdEquips, setFilterdEquips] = React.useState(originEquips)
  let [equips, setEquips] = React.useState(originEquips.slice(0, TABLE_LIMIT));
  let [sortStatus, setSortStatus] = React.useState({column:null, type:null});

  let [overEquip, setOverEquip] = React.useState((<div></div>));

  const selectEquip = (e, row) => {
    // console.log("Table selectEquip", e, row, props)

    //親
    props["parent"].selectEquip(row);
    props["parent"].closeEquipModal();
  }

  const changeSorting = (column) =>{
    setSortStatus({column: column, type: sortStatus["type"]==="asc"? "desc": "asc"})
    
    let _filterdEquips;
    if (sortStatus["type"]==="asc"){
      _filterdEquips = sortBy(originEquips, column)
    }else{
      _filterdEquips = sortBy(originEquips, column).reverse()
    }
    
    setFilterdEquips(_filterdEquips)
    let new_equips = _filterdEquips.slice(0, TABLE_LIMIT)
    setEquips(new_equips)
    // console.log("sortStatus", sortStatus)
  }
  
  const trackScrolling = (e) => {
    // console.log(e, e.target.offsetHeight, e.target.scrollTop, e.target.scrollHeight)
    if(e.target.scrollHeight <= e.target.scrollTop + e.target.offsetHeight){
      // console.log("filterdEnchants", filterdEquips)
      setEquips(equips.concat(filterdEquips.slice(equips.length, equips.length+TABLE_LIMIT)))
      // console.log("bottom", e, equips)
    }
  };

  const hoverEquip = (e, target_equip) => {
    // console.log("target_equip", target_equip)
  
    let origin_material = {}
  
    let material_tree = {};
    let _material_tree = {num:1, materials:{}}
    material_tree[target_equip["name"]] = _material_tree;
    
    check_material(target_equip.materials, _material_tree["materials"], target_equip["name"], 1)
    get_origin_materials(target_equip["name"], _material_tree, origin_material)

    function check_material(material, material_tree, parent_name, parent_num){
      if(material!==null){
        for (let material_name of Object.keys(material)){
  
          let _material = items[material_name]
          
          let total_num = material[material_name]*parent_num
          
          let _material_tree = {num: total_num, materials:{}}
          material_tree[material_name] = _material_tree
          
          if(parent_name===material_name)continue;
          
          check_material(_material["materials"], _material_tree["materials"], material_name, total_num);
        }
      }
    }
    
    function get_origin_materials(name, material, origin_material){
      if (material["materials"]==null || Object.keys(material["materials"]).length===0){
        if(origin_material[name]==null){
          origin_material[name] = material["num"]
        }else{
          origin_material[name] += material["num"]
        }
      }
      
      for (let material_name of Object.keys(material["materials"])){
        let _material = material["materials"][material_name]
        get_origin_materials(material_name, _material, origin_material)
      }
    }
    
    let dom = (
      <>
        {
          Object.keys(material_tree).map((key, i)=>{
            // console.log("\t", material_tree)
            return (
              <div className="overOriginMaterial">
                <div className="headTable">原材料合計</div>
                <div>
                  {

                    (Object.keys(origin_material).length===1&&Object.keys(origin_material)[0]==key)?
                    (<div>なし</div>):
                    Object.keys(origin_material).map((key, i)=>{
                      return(<div>{key}×{origin_material[key]}</div>)
                    })
                  
                  }
                </div>
              </div>
  
            )
          })
        }
      </>
    );
    setOverEquip(dom)
  }

  const outEquip = (e) => {
    setOverEquip(<div></div>)
  }
  
  useImperativeHandle(ref, () => ({
    updateEquipList(equip_list) {
      setEquips(equip_list);
    }
  }));

  return (
    <section className="equipTableSection">
      {overEquip}
      <div className="tableMaster modalTable" onScroll={trackScrolling}>
        <table 
          className="equipTable"
          style={{whiteSpace: "nowrap", borderCollapse: "collapse"}}
        >
          <thead>
            <tr>
              {EQUIP_COLUMNS.map(column => (
                <th onClick={()=>{changeSorting(column['accessor'])}}>
                  {column['Header']}
                  <span>{sortStatus["column"]===column['accessor'] ? (sortStatus["type"]==="asc" ? ' ▼' : ' ▲') : ' 　'}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {equips.map((equip, i)  => {
              let style={}

              let row = (
                <tr
                    style={style}
                    onClick={(e) => selectEquip(e, equip)}
                    onMouseOver ={(e) => hoverEquip(e, equip)}
                    onMouseOut ={(e) => outEquip(e)}
                >
                  {EQUIP_COLUMNS.map((column, j) => (
                    <td>
                      {equip[column.accessor]}
                    </td>
                  ))}
                  {/* <MaterialTree key={i} equip={equip} parent={this} /> */}
                </tr>
              )
              return row
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
});

