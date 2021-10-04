import React, {forwardRef, createRef}  from 'react';

import './materialTreeSection.css';

const items = require('../assets/item_infos/item.json');

let MaterialTreeChild = forwardRef((props, ref) => {
  let materials = props["materials"]

  return (
    <div>
      {
        Object.keys(materials).map((key, i)=>{
          // console.log("\t", materials)
          return (
            <div key={key}>
              <div className="treeChild" >
                <div className="treeParent">
                  <div>
                    <span style={{whiteSpace:"nowrap"}}>{key}</span>
                    <span style={{whiteSpace:"nowrap"}}>×{materials[key]["num"]}</span>
                  </div>
                </div>
                <MaterialTreeChild materials={materials[key]["materials"]} />
              </div>
            </div>
          )
        })
      }
    </div>
  );
})




let MaterialTree = forwardRef((props, ref) => {
  let equipPart = props["equip_part"]
  let origin_material = {}

  let dom = (
    <div className="materialTree">
      <div>{equipPart.title}</div>
      <div></div>
      <div>{equipPart.target && equipPart.target.name}</div>
    </div>)

  if(equipPart.target!=null){
    let target_equip = equipPart.target;

    // console.log("target_equip", target_equip)
    let material_tree = {};
    let _material_tree = {num:1, materials:{}}
    material_tree[target_equip["name"]] = _material_tree;
    
    check_material(target_equip.materials, _material_tree["materials"], target_equip["name"], 1)
    // console.log("material_tree", material_tree)
    
    get_origin_materials(target_equip["name"], _material_tree, origin_material)
    // console.log("origin_material", origin_material)
    
    function check_material(material, material_tree, parent_name, parent_num){
      if(material!==null){
        for (let material_name of Object.keys(material)){
          let _material = items[material_name]

          let total_num = material[material_name]*parent_num
          
          let _material_tree = {num: total_num, materials:{}}
          material_tree[material_name] = _material_tree
          
          if(parent_name===material_name)continue;
          if(_material==null || _material_tree==null)continue;
          
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
    
    dom = (
      <>
        {
          Object.keys(material_tree).map((key, i)=>{
            // console.log("\t", material_tree)
            return (
              <div className="materialTree" key={i+"materialTree"}>
                <div className="equip_type">{equipPart.title}</div>
                <div className="treeAncestor">
                  <div>
                    <div className="treeParent">{key}</div>
                    <MaterialTreeChild materials={material_tree[key]["materials"]} />
                  </div>
                </div>
                <div className="originMaterial">
                  <div>
                    {
                      Object.keys(origin_material).map((key, i)=>{
                        return(<div key={i+"_originMaterial"}>{key}×{origin_material[key]}</div>)
                      })
                    
                    }
                  </div>
                </div>
              </div>

            )
          })
        }
      </>
    );
  }

  return dom;
})


export default  forwardRef((props, ref) => {
  let equip_parts = props["equip_parts"]
  
  let equipRefs = equip_parts.map((_, i) => createRef());
  
  return (
    <article className="materialSection">
      <div className="title">素材ツリー</div>
      <div className="body">
        <div className="table">
          <div className="materialTreeHead headTable">
            <div>装備箇所</div>
            <div>素材ツリー</div>
            <div>原材料</div>
          </div>
          {equip_parts.map((equip_part, i) => {
            return (
              <MaterialTree ref={equipRefs[i]} key={i} equip_part={equip_part} parent={this} />
            )
          })}
        </div>
      </div>
    </article>
  )
})
