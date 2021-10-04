/* eslint-disable array-callback-return */
import "./equipSelector.css"
import React, {createRef}  from 'react';

// import EnchantTable from "./enchantTable copy.js";
import EquipTable from "./equipTable.js";
import EnchantTable from "./enchantTable.js";

import Config from '../configs/configs.json'; // 追加
const items = require('../assets/item_infos/item.json');
const EQUIP_COLUMNS = Config.EQUIP_COLUMNS
const ENCHANTMENT_COLUMNS = Config.ENCHANTMENT_COLUMNS

export default class EquipSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = { 
      isEquipOpen: false, 
      isEnchantOpens: [false, false, false, false], 
      targetEquip: null, 
      searchEquipText: "", 
      searchEnchantTexts: ["", "", "", ""]
    };
    this.timeOutId = null;
	
  	this.name = props["equip_part"]["title"];
  	this.frame_position = props["frame_position"];
  	this.parent = props["parent"];
  	
  	this.equips_list = props["equip_list"];
  	this.equip_part = props["equip_part"];
    
  	this.enchantment_list = props["enchantment_list"];

    this.openEquipModal = this.openEquipModal.bind(this);
    this.closeEquipModal = this.closeEquipModal.bind(this);
    this.handleEquipChange = this.handleEquipChange.bind(this);
    this.onClickHandler = this.onClickHandler.bind(this);
    this.selectEquip = this.selectEquip.bind(this);
    this.selectEnchant = this.selectEnchant.bind(this);

    this.equipTableRef = createRef();
    this.enchantTableRef = this.equip_part.enchantments.map((_, i) => createRef());
    this.enchantTableDom = this.equip_part.enchantments.map((_, i) => null);

    this.enchantStatus = this.equip_part.enchantments.map((_, i) => {return {}});

    // console.log("EquipSelector", this)
  }

  selectEquip(row) {
    // console.log("EquipSelector selectEquip", row, this.parent, this.state)
    this.setState({targetEquip: row});
    
    this.equip_part.target = row
    this.parent.updateStatus()
  }

  selectEnchant(index, row) {
    // console.log("EquipSelector selectEnchant", index, row, this.parent, this.state)

    this.equip_part.enchantments[index] = row;

    this.enchantStatus[index] = {}
    if(row!=null){
      ENCHANTMENT_COLUMNS.map(column => {
        let key = column["accessor"]
        if(Object.keys(row).indexOf(key)!==-1 
          && row[key]!==0
          && key!=="name"
        ){
          let value = row[key]
          this.enchantStatus[index][key] = value;
        }
        return 0;
      })

      if( row["skill"]!=null){
        this.enchantStatus[index]["skill"] = {}
        for(let skill_name of Object.keys(row["skill"])){
          this.enchantStatus[index]["skill"][skill_name] = row["skill"][skill_name]
        }
      }
    }

    this.parent.updateStatus();
  }

  openEquipModal() {
    // console.log("openEquipModal", this)

    for(let equipPartRef of this.parent.equipPartRefs){
      equipPartRef.current.closeAllModal()
    }

    this.setState(currentState => ({
      isEquipOpen: true,
      isEnchantOpens: [false]*this.state.isEnchantOpens.length
      // isEquipOpen: !currentState.isEquipOpen
    }));
    // console.log(this.state.isEquipOpen)
  }

  openEnchantModal(index, e) {
    // console.log("openEnchantModal", this)
    for(let equipPartRef of this.parent.equipPartRefs){
      equipPartRef.current.closeAllModal()
    }

    let _enchantTable = [];
    for (let i in this.isEnchantOpens){
      if (i===index){
        _enchantTable.push(true);
      }else{
        _enchantTable.push(false);
      }
    }

    _enchantTable[index] = true;
    this.setState(currentState => ({
      isEquipOpen: false,
      isEnchantOpens: _enchantTable
      // isEquipOpen: !currentState.isEquipOpen
    }));

    this.setEnchantTable(index, e)
  }

  closeEquipModal() {
    this.setState(currentState => ({
      isEquipOpen: false
      // isEquipOpen: !currentState.isEquipOpen
    }));
  }

  closeEnchantModal() {
    // this.setState(currentState => ({
    //   isEnchantOpens:[false, false, false, false]
    // }));

    this.setState(currentState => ({
      isEnchantOpens: [false]*this.state.isEnchantOpens.length
    }));
    this.parent.setState(currentState => ({
      enchant_table: null
    }));
  }

  closeAllModal() {
    this.setState(currentState => ({
      isEquipOpen: false,
      isEnchantOpens: [false]*this.state.isEnchantOpens.length
    }));

    this.parent.setState(currentState => ({
      enchant_table: null
    }));
  }

  handleEquipChange(e) {
    this.setState({searchEquipText:e.target.value})
    let filterd_equips_list = [];

    if (this.equipTableRef.current){
      for(let equip of this.equips_list){
        if(equip["name"].indexOf(e.target.value)!==-1){
          filterd_equips_list.push(equip)
        }
      }
      // console.log("handleEquipChange", !this.equipTableRef.current, this.state.searchEquipText, filterd_equips_list)
      this.equipTableRef.current.updateEquipList(filterd_equips_list);
    }
  }

  handleEnchantChange(index, e) {
    let _searchEnchantTexts = this.state.searchEnchantTexts.slice();
    _searchEnchantTexts[index] = e.target.value;
    this.setState(currentState => ({
      searchEnchantTexts: _searchEnchantTexts
    }));

    let filterd_enchant_list = [];

    if (this.enchantTableRef[index].current){
      for(let enchantment of this.enchantment_list){
        if(enchantment["name"].indexOf(e.target.value)!==-1){
          filterd_enchant_list.push(enchantment)
        }
      }
      // console.log("handleEnchantChange", this.enchantTableRef[index].current, this.state.searchEnchantTexts, filterd_enchant_list)
      this.enchantTableRef[index].current.updateEquipList(filterd_enchant_list);
    }
  }

  onClickHandler(e) {
    // console.log("onClickHandler", this, e, e.currentTarget)
  }

  setEquipTable(){
    this.filtered_equips_list = [];
    for(let equip of this.equips_list){
      if(equip["name"].indexOf(this.state.searchEquipText)!==-1){
        this.filtered_equips_list.push(equip)
      }
    }
    this.equipTableDom = ( <EquipTable ref={this.equipTableRef} parent={this} EQUIP_COLUMNS={EQUIP_COLUMNS} data={this.filtered_equips_list} target_equip={this.name} />);
    return this.equipTableDom
  }

  setEnchantTable(index, e){
    let filtered_enchantment_list = [];

    for(let enchant of this.enchantment_list){
      if(enchant["name"].indexOf(this.state.searchEnchantTexts[index])!==-1){
        filtered_enchantment_list.push(enchant);
      }
    }

    let top = 0;
    let element = e.nativeEvent.target
    do {
        top += element.offsetTop  || 0;
        element = element.offsetParent;
    } while(element);

    top += e.nativeEvent.target.clientHeight+4
    console.log("SSSSSSSS", e, e.view.outerHeight, e.nativeEvent.target.offsetTop, top)
    
    this.enchantTableDom[index] = ( 
      <EnchantTable 
        ref={this.enchantTableRef[index]} 
        id={index} 
        parent={this} 
        data={filtered_enchantment_list} 
        target_enchant={this.equip_part.enchantments[index]} 
        top={top}
      />);
    this.parent.setState(currentState => ({
      enchant_table: this.enchantTableDom[index]
    }));
    
  }

  MaterialInfo(){
    const target_equip = this.state.targetEquip;

    let origin_material = {}
  
    let material_tree = {};
    let _material_tree = {num:1, materials:{}}
    material_tree[target_equip["name"]] = _material_tree;
    
    check_material(target_equip.materials, _material_tree["materials"], target_equip["name"], 1)
    get_origin_materials(target_equip["name"], _material_tree, origin_material)

    function check_material(material, material_tree, parent_name, parent_num){
      if(material!=null){
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
    
    let dom = (
      <>
        {
          Object.keys(material_tree).map((key, i)=>{
            // console.log("\t", material_tree)
            return (
              <div className="overOriginMaterial" key={key+"overOriginMaterial"}>
                <div className="headTable">原材料合計</div>
                <div>
                  {
                    (Object.keys(origin_material).length===1&&Object.keys(origin_material)[0]===key)?
                    (<div>なし</div>):
                    Object.keys(origin_material).map((key, j)=>{
                      return(<div key={key+"overOriginMaterial_material"}>{key}×{origin_material[key]}</div>)
                    })
                  }
                </div>
              </div>
            )
          })
        }
      </>
    );
    return dom
  }
  

  clearEquip(e){
    // console.log("clearEquip", e, this)
    this.selectEquip(null);
  }

  clearEnchant(e, i){
    // console.log("clearEnchant", e, i, this)
    this.selectEnchant(i, null)
  }
  
  mouseMove(e, i){
    // tbodyDom.style.left = window.scrollX - sectionDom.offsetLeft + sectionDom.scrollLeft + e.clientX + 25 + "px";
    // tbodyDom.style.top = - sectionDom.offsetTop + sectionDom.scrollTop + e.clientY - 7 + "px";
    
    let enchantDom = document.querySelector('.enchantInfoBalloon');
    enchantDom.style.left = window.scrollX + e.clientX + 25 + "px";
    enchantDom.style.top = window.scrollY + e.clientY - 7 + "px";
  }
  
  mouseOver(e, i){
    this.parent.setState(currentState => ({
      enchantInfoBalloon: this.enchantStatus[i]
    }));
  }

  mouseOut(e, i){
    this.parent.setState(currentState => ({
      enchantInfoBalloon: null
    }));
  }
  
  render() {
    let table_style = {position:"absolute", zIndex:10, maxWidth:"1100px"}
    table_style[this.frame_position] = 0

    return (
      <article className={'equipmentFrame ' + this.equip_part['code']}>
        <div className="title">{this.name}</div>
        <div className="equipInfo">
          {this.state.targetEquip && (
            <>
              {this.MaterialInfo()}
              <div className={"equipName equip_rarelity_"+this.state.targetEquip["rarelity"]}>{this.state.targetEquip.name}</div>
              <div className="equipStatus">
                ATK:{this.state.targetEquip.atk}&nbsp;
                MATK:{this.state.targetEquip.matk}&nbsp;
                DEF:{this.state.targetEquip.def}&nbsp;
                ASPD:{this.state.targetEquip.aspd}
              </div>
            </>
          )}
        </div>
        <div className="inputEquip">
          <span className="clearEquip" onClick={(e)=>{this.clearEquip(e)}}>×</span>
          <input type="search" id="name" name="name" autoComplete="off" size="25" 
            className={(this.state.isEquipOpen)?"focus":""}
            value={this.state.searchEquipText} 
            placeholder="装備の名前を入力してください" 
            onChange={this.handleEquipChange} 
            onFocus={this.openEquipModal}
          />
          {this.state.isEquipOpen && this.setEquipTable()}
        </div>
        <div className="enchantment_list">
          {this.equip_part.enchantments.map((equip_part, i) => {
            return(
              <div key={i+"enchantment_list"}>
                <div className="inputEnchant">
                  <span className="clearEnchant" onClick={(e)=>{this.clearEnchant(e, i)}}>×</span>
                  <input type="search" id="name" name="name" autoComplete="off" size="10" 
                    className={(this.state.isEnchantOpens[i])?"focus":""}
                    value={this.state.searchEnchantTexts[i]} 
                    onChange={(e)=>{this.handleEnchantChange(i, e)}} 
                    onFocus={(e)=>{this.openEnchantModal(i, e)}}
                  />
                </div>
                {this.equip_part.enchantments[i] && (
                  <span className={"enchantInfo enchant_rarelity_"+this.equip_part.enchantments[i]["rarelity"]}
                    onMouseOver={(e)=>{this.mouseOver(e, i)}} 
                    onMouseMove={(e)=>{this.mouseMove(e, i)}} 
                    onMouseOut={(e)=>{this.mouseOut(e, i)}} 
                  >
                    {this.equip_part.enchantments[i]["name"]}
                  </span>
                )}
              </div>
            )
          })}
        </div>
        
      </article>
    );
  }
}