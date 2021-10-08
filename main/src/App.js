/* eslint-disable array-callback-return */
import './App.css';
import React, {createRef} from 'react';

import EquipSelector from "./components/equipSelector";
import MaterialTreeSection from "./components/materialTreeSection";
import EnchantDetailSection from "./components/enchantDetailSection";

import Config from './configs/configs.json';
import Info from './configs/info.json';
const EQUIP_LABELS = Config.EQUIP_LABELS;
const STATUS_LABELS = Config.STATUS_LABELS;
const INPUT_STATUS_LABELS = Config.INPUT_STATUS_LABELS;
const UNIQUE_LABELS = Config.UNIQUE_LABELS;
const EQUIP_STATUS_KEY_LABELS = Config.EQUIP_STATUS_KEY_LABELS;
const STATUS_RANGES = Config.STATUS_RANGES;
const ENCHANTMENT_COLUMNS = Config.ENCHANTMENT_COLUMNS
const EQUIP_PARTS = Config.EQUIP_PARTS

const head_equips = require('./assets/equip_infos/頭装備.json');
const body_equips = require('./assets/equip_infos/体装備.json');
const glider_equips = require('./assets/equip_infos/グライダー.json');
const accessory_equips = require('./assets/equip_infos/アクセサリー.json');
const other_equips = require('./assets/equip_infos/弾・戦闘補助.json');
const shield_equips = require('./assets/equip_infos/盾.json');
const one_h_sword_equips = require('./assets/equip_infos/片手剣.json');
const two_h_sword_equips = require('./assets/equip_infos/両手剣.json');
const spear_equips = require('./assets/equip_infos/槍.json');
const bow_equips = require('./assets/equip_infos/弓.json');
const gun_equips = require('./assets/equip_infos/銃.json');
const rod_equips = require('./assets/equip_infos/魔法杖.json');
const tool_equips = require('./assets/equip_infos/ツール.json');

let enchantment_list = require('./assets/enchantment_infos/enchantment.json');

let ENCHANT_CONVERTER = {
  エンチャント名: "name",
  ATK: "atk",
  ATK割合: "atk_per",
  MATK: "matk",
  MATK割合: "matk_per",
  "DEFのN%ATK増加": "def_for_atk",
  "DEFのN%MATK増加": "def_for_matk",
  "ライフのN%ATK増加": "life_for_atk",
  "ライフのN%MATK増加": "life_for_matk",
  "マナのN%ATK増加": "mana_for_atk",
  "マナのN%MATK増加": "mana_for_matk",
  DEF: "def",
  DEF割合: "def_per",
  最大スタ: "stamina",
  最大スタ割合: "stamina_per",
  最大マナ: "mana",
  最大マナ割合: "mana_per",
  最大ライフ: "life",
  最大ライフ割合: "life_per",
  最大満腹度: "hunger",
  最大満腹度割合: "hunger_per",

  移動速度: "mv",
  空中速度: "amv",

  ASPD: "aspd",
  アイテムCD: "item_cd",
  スキルCD: "skill_cd",
  物理クリダメ: "crit_dmg",
  物理クリ確率: "crit_per",
  魔法クリダメ: "mcrit_dmg",
  魔法クリ確率: "mcrit_per",
  マナ自然回復量: "mana_recovery_per",
  スタミナ自然回復量: "stamina_recovery_per",
  満腹度消費量:"hunger_utility_per",
}

for(let enchantment of enchantment_list){
  for(let old_key of Object.keys(enchantment)){
    let new_key = ENCHANT_CONVERTER[old_key]
    if(new_key==null)continue
    delete Object.assign( enchantment, {[new_key]: enchantment[old_key] })[old_key];
  }
}
for(let enchantment of enchantment_list){
  for(let enchant_column of ENCHANTMENT_COLUMNS){
    if(enchantment[enchant_column["accessor"]]==null){
      enchantment[enchant_column["accessor"]] = 0
    }
  }
}

const where_to_equip ={
  "right_hand":["one_h_sword_equips", "two_h_sword_equips", "spear_equips", "bow_equips", "gun_equips", "tool_equips", "rod_equips"],
  "head":["head_equips"], 
  "body":["body_equips"], 
  "left_hand":["shield_equips", "one_h_sword_equips"], 
  "accessory1":["accessory_equips"],
  "accessory2":["accessory_equips"],
  "glider":["glider_equips"], 
  "other":["other_equips"], 
}

let equip_parts = [
  { code: "right_hand", title: EQUIP_PARTS["right_hand"], options:[], target:null, equip_list:[], enchantments:[null, null, null, null] },
  { code: "head", title: EQUIP_PARTS["head"], options:[], target:null, equip_list:[], enchantments:[null, null, null, null]},
  { code: "body", title: EQUIP_PARTS["body"], options:[], target:null, equip_list:[], enchantments:[null, null, null, null]},
  { code: "left_hand", title: EQUIP_PARTS["left_hand"], options:[], target:null, equip_list:[], enchantments:[null, null, null, null]},
  { code: "accessory1", title: EQUIP_PARTS["accessory1"], options:[], target:null, equip_list:[], enchantments:[null, null, null, null]},
  { code: "accessory2", title: EQUIP_PARTS["accessory2"], options:[], target:null, equip_list:[], enchantments:[null, null, null, null]},
  { code: "glider", title: EQUIP_PARTS["glider"], options:[], target:null, equip_list:[], enchantments:[null, null, null, null]},
  { code: "other", title: EQUIP_PARTS["other"], options:[], target:null, equip_list:[], enchantments:[null, null, null, null]},
];

// 装備一覧インポート
for(let equip_part of equip_parts){
  let equip_list = []
  
  for(let target_json_name of where_to_equip[equip_part.code]){
    let json_datas = eval(target_json_name);
    
    for(let json_data of json_datas){
      
      let target_equip = {}
      target_equip["skill"] = {}
      target_equip["type"] = EQUIP_LABELS[target_json_name]
      for(let EQUIP_STATUS_KEY of Object.keys(EQUIP_STATUS_KEY_LABELS)){
        let EQUIP_STATUS_LABEL= EQUIP_STATUS_KEY_LABELS[EQUIP_STATUS_KEY]
        target_equip[EQUIP_STATUS_KEY] = (json_data[EQUIP_STATUS_LABEL]!=null)?json_data[EQUIP_STATUS_LABEL]:0
      }
      target_equip["skill"] = json_data["skill"]
      equip_list.push(target_equip)
      
    }
  }
  equip_part.list = equip_list;
}

let status = {
  life:0,
  stamina:0,
  mana:0,
  atk:0,
  matk:0,
  def:0,
  aspd:0,
  hunger:0,
  mv:0,
  amv:0,
  item_cd:0,
  skill_cd:0,
  crit_per:0,
  crit_dmg:0,
  mcrit_per:0,
  mcrit_dmg:0,
  mana_recovery_per:0,
  stamina_recovery_per:0,
  hunger_utility_per:0,
  skills:{},
}

let basic_status = {}
Object.keys(INPUT_STATUS_LABELS).map((key, i) => {
  basic_status[key] = 0;
})

let addition_status = {
  life:0,
  stamina:0,
  mana:0,
  atk:0,
  matk:0,
  def:0,
  hunger:0,
}

let multiply_per_status ={
  life:0,
  stamina:0,
  mana:0,
  atk:0,
  matk:0,
  def:0,
  hunger:0,
}

let multiply_per_sum_status ={
  life:0,
  stamina:0,
  mana:0,
  atk:0,
  matk:0,
  def:0,
  hunger:0,
}

let per_status ={
  mv:0,
  amv:0,
  aspd:0,
  item_cd:0,
  skill_cd:0,
  crit_per:0,
  crit_dmg:0,
  mcrit_per:0,
  mcrit_dmg:0,
  mana_recovery_per:0,
  stamina_recovery_per:0,
  hunger_utility_per:0,
}

let unique_status = {
  atk:{
    def:0,
    life:0,
    mana:0,
  },
  matk:{
    def:0,
    life:0,
    mana:0,
  }
}

let unique_result_status = {
  atk:{
    def:0,
    life:0,
    mana:0,
  },
  matk:{
    def:0,
    life:0,
    mana:0,
  }
}


export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.equipPartRefs = equip_parts.map((_, i) => createRef());
    this.enchantDetailRefs = createRef()
    this.materialTreeRefs = createRef()

    this.state = { 
      basic_status: {...basic_status}, 
      result_status: {...status}, 
      isEnchantOpens: false,
      targetSave: 0, 
      titleNames:["", "", ""],
      targetTable:null,
      enchant_table: null,
      enchantInfoBalloon: null,
      HoverSaveData: null,

      material_enchants: Array(equip_parts.length),
      
      confirm_save: null
    };

    this.updateStatus = this.updateStatus.bind(this);
    this.changeBasicStatus = this.changeBasicStatus.bind(this);
    this.onClickHandler = this.onClickHandler.bind(this);
    this.openEnchantTable = this.openEnchantTable.bind(this);
    this.importSavedata = this.importSavedata.bind(this);
    this.exportSavedata = this.exportSavedata.bind(this);
    this.clearAll = this.clearAll.bind(this);

  }

  componentDidMount(){
    this.importSavedata(0)
  }

  updateStatus(){
    // console.log("App updateStatus", equip_parts)
    
    let res = {}
    let skills = {}
    for(let key of Object.keys(this.state.result_status)){
      res[key] = 0;
    }

    for(let key of Object.keys(addition_status)){
      addition_status[key] = 0
    }
    for(let key of Object.keys(multiply_per_status)){
      multiply_per_status[key] = 0
    }
    for(let key of Object.keys(per_status)){
      per_status[key] = 0
    }
    for(let key1 of Object.keys(unique_status)){
      for(let key2 of Object.keys(unique_status[key1])){
        unique_status[key1][key2] = 0
      }
    }

    for (let key of Object.keys(this.state.basic_status)){
      addition_status[key] += this.state.basic_status[key]
    }
    for(let equip_part of equip_parts){
      if(equip_part.target != null){
        for(let key of Object.keys(equip_part.target)){
          let value = equip_part.target[key]

          if(value == null)continue

          if (addition_status[key]!=null){
            addition_status[key] += value
          }

          if ( Object.keys(multiply_per_status).map((a, i)=>{return a+"_per"}).indexOf(key)!==-1){
            multiply_per_status[key] += value
          }

          if (per_status[key]!=null){
            per_status[key] += value
          }

          for(let unique_key1 of Object.keys(unique_status)){
            for(let unique_key2 of Object.keys(unique_status[unique_key1])){
              if (key === unique_key2+"_for_"+unique_key1){
                unique_status[unique_key1][unique_key2] += value
              }
            }
          }

        }
        // console.log("equip_part", equip_part)
        for(let skill_name of Object.keys(equip_part.target["skill"])){
          if(skills[skill_name]==null){
            skills[skill_name] = 0
          }
          skills[skill_name] += equip_part.target["skill"][skill_name]
        }

      }
      for(let enchantment of equip_part.enchantments){
        if(enchantment == null)continue
        
        for(let key of Object.keys(enchantment)){
          let value = enchantment[key]
          if(value == null)continue

          if ( key in addition_status){
            addition_status[key] += value
          }

          if ( Object.keys(multiply_per_status).map((a, i)=>{return a+"_per"}).indexOf(key)!==-1){
            multiply_per_status[key.replace("_per", "")] += value
          }

          if ( key in per_status){
            per_status[key] += value
          }

          for(let unique_key1 of Object.keys(unique_status)){
            for(let unique_key2 of Object.keys(unique_status[unique_key1])){
              if (key === unique_key2+"_for_"+unique_key1){
                unique_status[unique_key1][unique_key2] += value
              }
            }
          }

        }
        
        for(let skill_name of Object.keys(enchantment["skill"])){
          if(skills[skill_name]==null){
            skills[skill_name] = 0
          }
          skills[skill_name] += enchantment["skill"][skill_name]
        }
        
      }
    }
    
    for (let key of Object.keys(res)){
      res[key] += addition_status[key]
    }

    for(let unique_key1 of Object.keys(unique_status)){
      for(let unique_key2 of Object.keys(unique_status[unique_key1])){
        if(unique_status[unique_key1][unique_key2]!==0){

          unique_result_status[unique_key1][unique_key2] = Math.round(res[unique_key2]*unique_status[unique_key1][unique_key2]/100);
          res[unique_key1] += unique_result_status[unique_key1][unique_key2];
        }
      }
    }
    
    for (let key of Object.keys(res)){

      if(key in multiply_per_status){
        multiply_per_sum_status[key] = Math.round(((addition_status[key]<0)?0:addition_status[key])*multiply_per_status[key]*0.01)
        res[key] += ((addition_status[key]<0)?0:addition_status[key])*multiply_per_status[key]*0.01
        res[key] = Math.round(res[key]*1000)/1000
      }
      
      if(key in per_status){
        res[key] = per_status[key]
      }
    }

    for (let key of Object.keys(res)){
      res[key] = Math.round(res[key]);
    }

    res["skills"] = skills

    // console.log("updateStatus", this.state.basic_status, addition_status ,multiply_per_status, unique_status, res)
    this.setState({result_status:res})
  }


  changeBasicStatus(e, key){
    let value = e.target.value*1
    if(value == null){
      value = 0;
    }
    let _basic_status = this.state.basic_status;
    _basic_status[key] = value;

    this.setState(currentState => ({
      basic_status: _basic_status,
    }));
    
    this.updateStatus();
    // console.log("changeBasicStatus", e, key, this.state.basic_status, this.state.result_status)
  }


  onClickHandler(e){
    // console.log("App onClickHandler", e, equip_parts,
    // e.target.closest(".inputEquip"),
    // e.target.closest(".inputEnchant"),
    // e.target.closest(".enchantTableSection"),
    // )
    if (!(e.target.closest(".inputEquip")||e.target.closest(".inputEnchant")||e.target.closest(".enchantTableSection"))) {
      for(let equip_part_ref of this.equipPartRefs){
        if(equip_part_ref.current)
          equip_part_ref.current.closeAllModal()
      }
      this.setState({isEnchantOpens:false})
    }
  }

  openEnchantTable(table_index, enchantIndex, e){
    // console.log("openEnchantTable", this.state.isEnchantOpens, table_index, enchantIndex, e)
    this.setState({isEnchantOpens:!this.state.isEnchantOpens})
  }

  importSavedata(index){
    // console.log("importSavedata", index, savedata)

    this.setState({targetSave:index})
    let fileFrames = document.getElementsByClassName("fileFrame");

    for (let fileFrame of fileFrames)
      fileFrame.classList.remove("targetSavedata")

      fileFrames[index].classList.add("targetSavedata")
    
    const strage_index = "save_"+index;
    const savedata_str = localStorage.getItem(strage_index);

    if (savedata_str ==null){
      this.clearAll();
      return;
    }

    const savedata = JSON.parse(savedata_str)

    for(let equip_part_index in equip_parts){
      let equip_part = equip_parts[equip_part_index]
      const code = equip_part.code;
      
      let target_equip = null
      if (Object.keys(savedata.equips).indexOf(code)!==-1){
        const equip_name = savedata.equips[code].name;

        for(let target_json_name of where_to_equip[equip_part.code]){
          let json_datas = eval(target_json_name);

          for(let json_data of json_datas){
            if (json_data["アイテム名"]!==equip_name) continue;

            target_equip = {}
            target_equip["type"] = EQUIP_LABELS[target_json_name]
            for(let EQUIP_STATUS_KEY of Object.keys(EQUIP_STATUS_KEY_LABELS)){
              let EQUIP_STATUS_LABEL= EQUIP_STATUS_KEY_LABELS[EQUIP_STATUS_KEY]
              target_equip[EQUIP_STATUS_KEY] = (json_data[EQUIP_STATUS_LABEL]!=null)?json_data[EQUIP_STATUS_LABEL]:0
            }
            target_equip["skill"] = json_data["skill"]

            break;
          }
        }
      }
      this.equipPartRefs[equip_part_index].current.selectEquip(target_equip);

      for(let enchantment_index in equip_part.enchantments){
        
        let value = null
        if (Object.keys(savedata.equips).indexOf(code)!==-1){
          let save_enchantment_name = savedata.equips[code].enchantments[enchantment_index]
          if (save_enchantment_name!==null){
            for(let enchantment of enchantment_list){ //これ最適化できないか
              if(save_enchantment_name === enchantment["name"]){
                value = enchantment;
                break;
              }
            }
          }
        }
        this.equipPartRefs[equip_part_index].current.selectEnchant(enchantment_index, value)
      }
    }

    let _basic_status = {...basic_status}
    for(let status_key in this.state.basic_status){
      if(savedata["basic_status"][status_key] !=null)
        _basic_status[status_key] = savedata["basic_status"][status_key];
    }
    
    this.setState({basic_status:_basic_status});
    this.state.basic_status = _basic_status;
    this.updateStatus();

  }


  exportSavedata(e, index){
    let savedata = {}
    savedata["equips"] = {}
    savedata["basic_status"] = this.state.basic_status

    for(const equip_part of equip_parts){
      if(equip_part.target===null)continue;

      savedata["equips"][equip_part.code] = {
        name:equip_part.target.name,
        enchantments:[]
      }
      for(const index in equip_part.enchantments){
        const enchantment = equip_part.enchantments[index]
        if(enchantment==null) continue;

        savedata["equips"][equip_part.code].enchantments.push(enchantment.name)
      }
    }

    const strage_index = "save_"+index;
    const savedata_str = JSON.stringify(savedata)

    localStorage.setItem(strage_index, savedata_str);
  }

  setConfirm(target){
    this.setState({confirm_save:target});
  }
  
  clearAll(e){
    // console.log("clearAll", e)

    for(let equip_part_index in equip_parts){
      let equip_part = equip_parts[equip_part_index]

      this.equipPartRefs[equip_part_index].current.selectEquip(null);

      for(let enchantment_index in equip_part.enchantments){
        this.equipPartRefs[equip_part_index].current.selectEnchant(enchantment_index, null)
      }
    }

    let _basic_status = this.state.basic_status
    for(let status_key in this.state.basic_status){
      _basic_status[status_key] = 0
    }
    
    this.updateStatus()
  }

  scroll(e, className){
    let  element = document.getElementsByClassName(className)[0];
    
    window.scroll({
      top: element.offsetTop,
      behavior: "smooth"
    });
  }

  setPerResult(key){
    let value = this.state.result_status[key]

    if(STATUS_RANGES[key]!=null
      && STATUS_RANGES[key][0]!=null && this.state.result_status[key]<STATUS_RANGES[key][0]){
      value = STATUS_RANGES[key][0]
    }else if(STATUS_RANGES[key]!=null
      && STATUS_RANGES[key][1]!=null && STATUS_RANGES[key][1]<this.state.result_status[key]){
      value = STATUS_RANGES[key][1]
    }

    return (value);
  }

  mouseoverFile(index, e){
    const strage_index = "save_"+index;
    const savedata_str = localStorage.getItem(strage_index);
    const savedata = JSON.parse(savedata_str)

    let res = []
    if(savedata==null || savedata["equips"]==null || Object.keys(savedata["equips"]).length===0){
      res = "(装備なし)"

    }else{
      for(let equip_part_key of Object.keys(EQUIP_PARTS)){
        let equip_part = savedata["equips"][equip_part_key]
        if(equip_part==null)continue
        res.push(<div key={EQUIP_PARTS[equip_part_key]}>{EQUIP_PARTS[equip_part_key] +":"+ equip_part.name}</div>)
        for(let enchantment_index in equip_part.enchantments){
          let enchantment_name = equip_part.enchantments[enchantment_index]
          res.push(<div key={EQUIP_PARTS[equip_part_key]+"_ENCHANT_"+enchantment_index} style={{"paddingLeft": "20px"}}>{enchantment_name}</div>)
        }
      }
    }

    this.setState({HoverSaveData:<div>{res}</div>});

  }

  mousemoveFile(e){
    let saveDom = document.querySelector('.saveBalloon');
    saveDom.style.left = e.pageX+10 + "px";
    saveDom.style.top = e.pageY+10 + "px";
  }

  mouseoutFile(e){
    this.setState({HoverSaveData:null});
  }

  render() {
    return (
      <div className="App" 
        onClick={this.onClickHandler} 
      >
        {(this.state.enchant_table!=null)&&this.state.enchant_table}
        
        <div className="enchantInfoBalloon"
          style={(this.state.enchantInfoBalloon!=null) ? {display:"block"}: {display:"none"}}
        >{
          (function (self) {
            if (self.state.enchantInfoBalloon != null){

              let datas = ENCHANTMENT_COLUMNS.map(column => {
                let key = column["accessor"]
                if(Object.keys(self.state.enchantInfoBalloon).indexOf(key)!==-1 
                  && self.state.enchantInfoBalloon[key]!==0
                  && key!=="name"
                  && key!=="rarelity"
                ){
                  let value = self.state.enchantInfoBalloon[key]
                  return <div key={"ENCHANT_BALLOON"+column["Header"]}><span>{column["Header"]}</span>: {value}</div>
                }
              })
              
              if(self.state.enchantInfoBalloon["skill"]!=null){
                let skills = Object.keys(self.state.enchantInfoBalloon["skill"]).map((skill_name)=>{
                  return <div key={"skill_"+skill_name+"_balloon"}>スキル：{skill_name} Lv{self.state.enchantInfoBalloon["skill"][skill_name]}</div>
                })
                datas = datas.concat(skills)
              }

              datas = datas.filter((n) => { return n != null });

              if(datas.length===0){
                datas.push(<div>(なし)</div>)
              }
              return datas
            }
          }(this))
        }</div>

        {(this.state.HoverSaveData!=null)&&(<div className="saveBalloon">{(this.state.HoverSaveData)}</div>)}
        
        <header>Craftopia 装備シミュレーター</header>
        <section className="saveSection">
          <div>
            {[...Array(5)].map((key, i) => { 
              return(
                <div key={"FILE_"+i} 
                  onMouseOver={(e)=>{this.mouseoverFile(i, e)}}
                  onMouseOut={(e)=>{this.mouseoutFile(e)}}
                  onMouseMove={(e)=>{this.mousemoveFile(e)}}
                >
                  <div className="fileFrame">
                    <input type="button" className="fileButton" value={"load"+i} onClick={(e)=>{this.importSavedata(i);this.setConfirm(null)}} />
                    <input type="button" className="saveButton" value={"save"+i} onClick={(e)=>this.setConfirm(i)} />
                  </div>

                </div>
              )
            })}
          </div>

            {
              (this.state.confirm_save!=null)&&
              (<div className="confirm">
                <span>現在の入力情報を <span style={{fontWeight: "bold",color: "#000"}}>save{this.state.confirm_save}</span> に上書きます。</span>
                <input type="button" className="saveButton" value="はい" onClick={(e)=>{this.exportSavedata(e, this.state.confirm_save);this.setConfirm(null)}} />
                <input type="button" className="saveButton" value="いいえ" onClick={(e)=>this.setConfirm(null)} />
              </div>)

            }
        </section>
        
        <div className="scrollButton">
          <div>
            <div onClick={(e)=>{this.scroll(e, "saveSection")}}>入力画面</div>
            <div onClick={(e)=>{this.scroll(e, "enchantDetail")}}>エンチャント詳細</div>
            <div onClick={(e)=>{this.scroll(e, "materialSection")}}>素材ツリー</div>
          </div>
        </div>

        <div>
          <input type="button" className="clearButton" value="clear" onClick={(e)=>this.clearAll(e)} />
        </div>

        <section className="main">
          <div>
            <section className="status">
              <article className="basicStatus">
                <div className="title" >基礎ステータス</div>
                <table>
                  <thead>
                    <tr role="row">
                      <th></th>
                      <th>基礎ステータス</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(INPUT_STATUS_LABELS).map((key, i) => { 
                      return(
                        <tr key={key}>
                          <td>{INPUT_STATUS_LABELS[key]}</td>
                          <td>
                            <input type="number" 
                              min="0"
                              style={{textAlign: "right", width: "80px"}} 
                              value={this.state.basic_status[key]}
                              onChange={(e)=>{this.changeBasicStatus(e, key)}}
                            />
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </article>

              <article className="totalStatus">
                <div className="title">合計ステータス</div>
                <table>
                  <thead>
                    <tr role="row">
                      <th></th>
                      <th>固定値合計</th>
                      <th>割合合計</th>
                      <th>特殊合計</th>
                      <th>合計</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(STATUS_LABELS).map((key, i) => { 
                      if(addition_status[key]!=null){
                        return(
                          <tr key={"RES_STATUS_"+key}>
                            <td>{STATUS_LABELS[key]}</td>
                            <td>
                              {(addition_status[key]<0)?0:addition_status[key]}
                              <span className="over">{(addition_status[key]<0)?`(${addition_status[key]})`:""}</span>
                            </td>
                            <td>{(multiply_per_status[key]>0)?"+":""}{multiply_per_status[key]}%({(multiply_per_sum_status[key]>0)?"+":""}{multiply_per_sum_status[key]})</td>
                            <td>{
                              (unique_status[key]!=null)?
                              Object.keys(unique_status[key]).map((key2, j)=>{
                                if(unique_status[key][key2]!=null && unique_status[key][key2]!==0)
                                  return <div>{UNIQUE_LABELS[key2+"_for_"+key]} {unique_status[key][key2]}%(+{unique_result_status[key][key2]})</div>
                              }):""
                            }</td>
                            <td>
                              {(this.state.result_status[key]<1)?1:this.state.result_status[key]}
                              <span className="over">{(this.state.result_status[key]<1)?`(${this.state.result_status[key]-1})`:""}</span>
                            </td>
                          </tr>
                        )
                      }else if(per_status[key]!=null){
                        return(
                          <tr key={"RES_STATUS_"+key}>
                            <td>{STATUS_LABELS[key]}</td>
                            <td></td>
                            <td>{(per_status[key]>0)?"+":""}{per_status[key]}%</td>
                            <td>{
                              (unique_status[key]!=null)?
                              Object.keys(unique_status[key]).map((key2, j)=>{
                                if(unique_status[key][key2]!=null && unique_status[key][key2]!==0)
                                return <div>{UNIQUE_LABELS[key2+"_for_"+key]} {unique_status[key][key2]}%(+{unique_result_status[key][key2]})</div>
                              }):""
                            }</td>
                            <td>
                              <span className={
                                ((STATUS_RANGES[key]!=null&&STATUS_RANGES[key][0]!=null)&&(this.state.result_status[key]<STATUS_RANGES[key][0])
                                ||(STATUS_RANGES[key]!=null&&STATUS_RANGES[key][1]!=null)&&(STATUS_RANGES[key][1]<this.state.result_status[key])) ? 'over' : ''}>
                              {(this.state.result_status[key]>0)?"+":""}
                              {this.setPerResult(key)}
                              %
                              {/* <span className="over"> */}
                                {
                                  (STATUS_RANGES[key]!=null&&STATUS_RANGES[key][0]!=null)&&(this.state.result_status[key]<STATUS_RANGES[key][0])?`(${this.state.result_status[key]-STATUS_RANGES[key][0]})`:""
                                }
                                {
                                  (STATUS_RANGES[key]!=null&&STATUS_RANGES[key][1]!=null)&&(STATUS_RANGES[key][1]<this.state.result_status[key])?`(${this.state.result_status[key]-STATUS_RANGES[key][1]})`:""
                                }
                              </span>
                            </td>
                          </tr>
                        )
                      }
                    })}
                    
                    <tr>
                      <td>スキル</td>
                      <td colSpan="4">{
                        
                          Object.keys(this.state.result_status["skills"]).map((key, i) => {
                            return (<div key={"TOTAL_"+key}>{key}: Lv.{this.state.result_status["skills"][key]}</div>)
                          }) 
                        }</td>
                    </tr>
                  </tbody>
                </table>
              </article>
            </section>

            <section className="equipSelectors">
              <div className="equipTableCell left">
                {equip_parts.map((equip_part, i) => {
                  if (i<=3){
                    return (
                      <EquipSelector
                        ref={this.equipPartRefs[i]}
                        key={i+"_equipSelectors"}
                        parent={this} 
                        table_index={i}
                        equip_part={equip_part}
                        equip_list={equip_part.list}
                        enchantment_list = {enchantment_list}
                        frame_position="left"
                        className="equip_selector"
                        />
                    )
                  }
                })}
              </div>
              <div className="equipTableCell right">
                {equip_parts.map((equip_part, i) => {
                  if (i>3){
                    return (
                      <EquipSelector
                        ref={this.equipPartRefs[i]}
                        key={i+"_equipSelectors"}
                        parent={this} 
                        table_index={i}
                        equip_part={equip_part}
                        equip_list={equip_part.list}
                        enchantment_list = {enchantment_list}
                        frame_position="right"
                        className="equip_selector"
                      />
                    )
                  }
                })}
              </div>
            </section>
          </div>
        </section>
        
        <EnchantDetailSection ref={this.enchantDetailRefs} equip_parts={equip_parts} parent={this} />

        <MaterialTreeSection ref={this.materialTreeRefs} equip_parts={equip_parts} parent={this} />
        
        <section className="caution">
          <article>
            <div>注意点</div>
            <ul>
              <li>アイテムを捧げることによって増加するステータスについては対応しておりません。</li>
            </ul>
          </article>
        </section>


        <section className="history">
          <article>
            <div>履歴</div>
            <div className="log">
              
              <div><span style={{width: "95px",display:"inline-block"}}>2021/10/08:</span>エンチャントマウスオーバー時の座標修正</div>
              <div><span style={{width: "95px",display:"inline-block"}}></span>素材修正</div>
              <div><span style={{width: "95px",display:"inline-block"}}></span>エンチャント追加</div>
              <div><span style={{width: "95px",display:"inline-block"}}>2021/09/29:</span>実装</div>
            </div>
          </article>
        </section>

        <section className="unimplemented">
          <article>
            <div>未実装機能</div>
            <ul>
              <li>パッチ v20210930.1502 対応中</li>
              <li>スマートフォン対応中</li>
            </ul>
          </article>
        </section>

        <footer>
          <span>last update: 2021/10/8</span>
          <span>ゲームver：{Info.gamepatch}</span>
          <span>情報は <a href="https://seesaawiki.jp/craftopia/">Craftopia/クラフトピア Wiki</a> 様を参考にさせていただいております。</span>
        </footer>
      </div>
    );
    }
}
