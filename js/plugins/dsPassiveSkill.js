//==============================================================================
// dsPassiveSkill.js
// Copyright (c) 2015 - 2017 Douraku
// Released under the MIT License.
// http://opensource.org/licenses/mit-license.php
//==============================================================================

/*:
* @plugindesc 被动技能实现 ver1.7.0
* @author 道楽(汉化:多卡多卡)
*
* @param 被动技能的技能类型
* @type number
* @desc 被动技能技能类型的编号，可以在战斗中隐藏此类技能
* @default 0
*
* @help
* RPGMaker MV 默认只有主动技能，而没有那种学习了就能生效的被动技能，
* 此插件可以设定被动技能，并且能够在战斗中将此类技能隐藏。
*
* 在汉化的过程中还添加了部分原插件没有的功能，
* 插件版权归原作者所有，插件的使用和二次修改遵守MIT协议。
* 可以将此插件用于商业和非商业用途游戏中，
* 但如果进行了修改或再次发布，需要保留原作者的版权声明。
* -----------------------------------------------------------------------------
* 使用此插件时需要建立一个被动技能类型，并将所有被动技能范围设置为无，
* 并将场合设置为不可使用
* (此操作不是必需的，但这样能让被动技能看起来更加和谐)
* 
* 注意:由于敌人没有学会技能这一概念，因此请不要尝试在敌人的行动模式中
* 添加被动技能!!!
*
* 在技能的注释栏添加以下内容可以实现被动效果:
* (当数字位数不足时以0补齐，如0002，特殊说明除外)
* 输入编号时不需要添加[],直接输入数值即可
* --------
* ・增加装备武器的种类(Equip Weapon)
* <passiveEWPN[武器类型]>
*  [武器类型] - 武器类型的编号(2位数字)
*
* --------
* ・增加装备防具的种类(Equip Weapon)
* <passiveEARM[防具类型]>
*  [防具类型] - 防具类型的编号(2位数字)
*
* --------
* ・增加通常能力值(Parameter Boost)
* <passivePBST[能力值编号]:[上升量(%)]>
*  [能力值编号] - 需要增加的通常能力值的编号(数字)
*                 0 - HP
*                 1 - HP
*                 2 - 攻击力
*                 3 - 防御力
*                 4 - 魔法攻击
*                 5 - 魔法防御
*                 6 - 敏捷
*                 7 - 幸运
*  [上升量(%)]  - 能力值的上升量(数字)
*                 如果没有%则代表数值上升，有%代表百分比上升，
*                 百分比上升时基准为没有装备时的数值。
*
* 无法在同一技能中同时增加数值和百分比，否则将由最后一条决定最终效果
* 例)<passivePBST0:10%>
*    <passivePBST0:100>
*    结果为增加100HP，而没有增加10%
*
* --------
* ・一定条件下增加通常能力值(Parameter Boost Ex)
* <passivePBSTEX[能力值编号]:[上升量(%)],[判定条件],[判定值]>
*  [能力值编号]   - 参考passivePBST
*  [上升量(%)]    - 参考passivePBST
*  [判定条件]     - 增强特定能力值的条件(文字)
*                   HPUP - HP在特定值以上发挥效果
*                   HPLW - HP在特定值以下发挥效果
*                   MPUP - MP在特定值以上发挥效果
*                   MPLW - MP在特定值以下发挥效果
*                   TPUP - TP在特定值以上发挥效果
*                   TPLW - TP在特定值以下发挥效果
*  [判定值]       - 判定条件对应的数值(数字)
*
* 例) HP50%以下时增加50%的攻击力:
* <passivePBSTEX2:50%,HPUP,50>
* 可以实现背水，浑身等技能特定条件下发挥的效果
*
* --------
* ・增加追加能力值(XParameter Boost)
* <passiveXPBST[能力值编号]:[上升量]>
*  [能力值编号] - 需要增加的追加能力值的编号(数字)
*                 0 - 命中率
*                 1 - 回避率
*                 2 - 暴击率
*                 3 - 暴击回避率
*                 4 - 魔法回避率
*                 5 - 魔法反射率
*                 6 - 反击率
*                 7 - HP自动恢复率
*                 8 - MP自动恢复率
*                 9 - TP自动恢复率
*  [上昇量]     - 能力值的上升量(数字)
*
* --------
* ・一定条件下增加追加能力值(XParameter Boost Ex)
* <passiveXPBSTEX[能力值编号]:[上升量],[判定条件],[判定值]>
*  [能力值编号]   - 参考passiveXPBST
*  [上升量]       - 参考passiveXPBST
*  [判定条件]     - 参考passivePBSTEX
*  [判定值]       - 参考passivePBSTEX
*
* 例) MP最大时追加5%的HP自动恢复:
* <passiveXPBSTEX7:5,MPUP,100>
*
* --------
* ・增加特殊能力值(SParameter Boost)
* <passiveSPBST[能力值编号]:[上升量]>
*  [能力值编号] - 需要增加的追加能力值的编号(数字)
*                 0 - 受到攻击几率
*                 1 - 防御效果
*                 2 - 恢复效果
*                 3 - 药理知识
*                 4 - MP消耗率
*                 5 - TP补充率
*                 6 - 受到的物理伤害倍率
*                 7 - 受到的魔法伤害倍率
*                 8 - 地形伤害倍率
*                 9 - 经验值获得率
*  [上升量]     - 能力值的上升量(数字)
*
* --------
* ・一定条件下增加特殊能力值(XParameter Boost Ex)
* <passiveSPBSTEX[能力值编号]:[上升量],[判定条件],[判定值]>
*  [能力值编号]   - 参考passiveSPBST
*  [上升量]       - 参考passiveSPBST
*  [判定条件]     - 参考passivePBSTEX
*  [判定值]       - 参考passivePBSTEX
*
* 例) TP50%以上时被攻击率减半:
* <passiveSPBSTEX0:50,TPUP,50>
*
* --------
* ※可以实现但不推荐 (推荐使用passivePBSTEX)
* ・一定HP以下增加通常能力值(Indomitable)
* <passiveINDM[能力值编号]:[剩余HP比例],[上升量(%)]>
*  [能力值编号] - 参考passivePBST
*  [剩余HP比例] - 发挥效果时剩余HP的百分比(数字)
*  [上升量(%)]  - 能力值的上升量(数字)
*                 如果没有%则代表数值上升，有%代表百分比上升，
*                 百分比上升时基准为没有装备时的数值。
*
* --------
* ※可以实现但不推荐 (推荐使用passiveXPBSTEX)
* ・一定HP以下增加追加能力值(XIndomitable)
* <passiveXINDM[能力值编号]:[剩余HP比例],[上升量(%)]>
*  [能力值编号] - 参考passiveXPBST
*  [剩余HP比例] - 发挥效果时剩余HP的百分比(数字)
*  [上升量]     - 能力值的上升量(数字)
*
* --------
* ※可以实现但不推荐 (推荐使用passiveSPBSTEX)
* ・一定HP以下增加特殊能力值(SIndomitable)
* <passiveSINDM[能力值编号]:[剩余HP比例],[上升量(%)]>
*  [能力值编号] - 参考passiveSPBST
*  [剩余HP比例] - 发挥效果时剩余HP的百分比(数字)
*  [上升量]     - 能力值的上升量(数字)
*
* --------
* ・属性有效度设定(Element Rate)
* <passiveELEM[属性编号]:[有效度]>
*  [属性编号] - 有效度对应的属性编号(2位数字)
*  [有效度]   - 对应属性的有效度的百分比(数字)
*               与职业和装备等的属性有效度采用乘算。
*
* ・元素攻击力增加(Element UP)
* <passiveELUP[属性编号]:[增加量(%)]>
*  [属性编号] - 增强攻击力的元素属性(普通攻击:-1,无:00,物理:01)(2位数字)
*  [增加量]   - 增强攻击力的百分比(数字)
*
* --------
* ・状态有效度设定(State Rate)
* <passiveSTAT[状态编号]:[有效度]>
*  [状态编号] - 有效度对应的状态编号(4位数字)
*  [有效度]   - 对应状态的有效度的百分比(数字)
*               与职业和装备等的状态有效度采用乘算。
*
* --------
* ・状态无效化(State Regist)
* <passiveSTREG[状态编号]>
*  [状态编号] - 无效化的状态(4位数字)
*
* --------
* ・攻击追加状态(Attack State)
* <passiveATKST[状态编号]:[付与率]>
*  [状态编号] - 攻击时付与的状态(4位数字)
*  [付与率]   - 对应状态付与率的百分比(数字)
*                   与职业和装备等的付与率采用乘算。
*
* --------
* ・追加技能类型(Add Skill Type)
* <passiveAST[技能类型编号]>
*  [技能类型编号] - 追加的技能类型的编号(2位数字)
*
* --------
* ・武器装备时增加的能力值UP(Weapon Mastery)
* <passiveWPNM[武器类型]:[上升量(%)]>
*  [武器类型]   - 武器类型的编号(2位数字)
*  [上升量(%)]  - 装备时能力值的上升量
*                 如果没有%则代表数值上升，有%代表百分比上升(数字)
*
* --------
* ・防具装备时增加的能力值UP(Armor Mastery)
* <passiveARMM[防具类型]:[上升量(%)]>
*  [防具类型]   - 防具类型的编号(2位数字)
*  [上升量(%)]  - 装备时能力值的上升量
*                 如果没有%则代表数值上升，有%代表百分比上升(数字)
*
* --------
* ・先制攻击率增加(Preemptive)
* <passivePREE:[上升量]>
*  [上升量] - 先制攻击率的增加量(数字)
*
* --------
* ・被偷袭率下降(Anti Surprise)
* <passiveASUP:[下降量]>
*  [下降量] - 被偷袭率的下降量(数字)
*
* --------
* ・增加金钱获取量(Gold Rate)
* <passiveGRUP:[上升量]>
*  [上升量] - 金钱获取量增加%(数字)
*
* --------
* ・增加物品掉率(Item Rate)
* <passiveIRUP:[上升量]>
*  [上升量] - 物品掉率增加%(数字)
*
* --------
* ・增加TP上限(Extra TP)
* <passiveEXTTP:[上升量]>
*  [上升量] - TP上限增加量
*
* --------
* ・增加输出的治疗量(Heal UP)
* <passiveHEUP:[上升量]>
*  [上升量] - 治疗量增加量%(数字)
*
* --------
* ・行动回数追加(Action Plus)
* <passiveAPLUS:[追加概率]>
*  [追加概率(%)] - 行动回数追加的概率%(数字)
*
* --------
* ・自动战斗状态(Auto Battle)
* <passiveAUTO>
*
* --------
* ・防御状态(Guard)
* <passiveGUARD>
*
* --------
* ・掩护状态(Substitute)
* <passiveSUBS>
*
* --------
* ・TP保留状态(Preserve Tp)
* <passivePRETP>
*
*/

var Imported = Imported || {};
Imported.dsPassiveSkill = true;

var dsPassiveSkill = dsPassiveSkill || {};
dsPassiveSkill.parameters = PluginManager.parameters('dsPassiveSkill');
dsPassiveSkill.parameters.hide = Number(dsPassiveSkill.parameters['被动技能的技能类型'] || 0);

(function (exports) {
    'use strict';

    //--------------------------------------------------------------------------
    /** Utility */
    function Utility() { }

    Utility.calcParamBoost = function (baseParam, metaData) {
        var ret = 0;
        var re = /([-]?\d+)(%?)/i;
        var match = re.exec(metaData);
        if (match) {
            if (match[2] === '%') {
                var rate = Number(match[1]) * 0.01;
                ret = Math.floor(baseParam * rate);
            }
            else {
                ret = Number(match[1]);
            }
        }
        return ret;
    };

    Utility.calcXParamBoost = function (metaData) {
        var ret = 0;
        var re = /([-]?\d+)/i;
        var match = re.exec(metaData);
        if (match) {
            ret = Number(match[1]) * 0.01;
        }
        return ret;
    };

    Utility.calcSParamBoost = function (metaData) {
        var ret = 0;
        var re = /([-]?\d+)/i;
        var match = re.exec(metaData);
        if (match) {
            ret = Number(match[1]) * 0.01;
        }
        return ret;
    };

    //--------------------------------------------------------------------------
    /** Game_Actor */
    Game_Actor.prototype.iteratePassiveSkill = function (metaName, callback) {
        this.skills().forEach(function (skill) {
            if (skill.meta[metaName]) {
                callback(skill.meta[metaName]);
            }
        });
    };

    Game_Actor.prototype.evaluateCondition = function (condition, value) {
        var ret = false;
        switch (condition) {
            case 'HPUP': ret = (this.hpRate() >= value * 0.01) ? true : false; break;
            case 'HPLW': ret = (this.hpRate() <= value * 0.01) ? true : false; break;
            case 'MPUP': ret = (this.mpRate() >= value * 0.01) ? true : false; break;
            case 'MPLW': ret = (this.mpRate() <= value * 0.01) ? true : false; break;
            case 'TPUP': ret = (this.tpRate() >= value * 0.01) ? true : false; break;
            case 'TPLW': ret = (this.tpRate() <= value * 0.01) ? true : false; break;
        }
        return ret;
    };

    var _Game_Actor_paramBase = Game_Actor.prototype.paramBase;
    Game_Actor.prototype.paramBaseDirect = function (paramId) {
        return _Game_Actor_paramBase.call(this, paramId);
    };

    Game_Actor.prototype.paramBaseBoost = function (paramId) {
        var baseParam = this.paramBaseDirect(paramId);
        var ret = 0;
        var tagPBST = 'passivePBST' + ('0' + paramId).slice(-1);
        this.iteratePassiveSkill(tagPBST, function (metaData) {
            ret += Utility.calcParamBoost(baseParam, metaData);
        });
        var tagPBSTEX = 'passivePBSTEX' + ('0' + paramId).slice(-1);
        this.iteratePassiveSkill(tagPBSTEX, function (metaData) {
            var splitData = metaData.split(',');
            if (this.evaluateCondition(splitData[1], Number(splitData[2]))) {
                ret += Utility.calcParamBoost(baseParam, splitData[0]);
            }
        }.bind(this));
        var tagINDM = 'passiveINDM' + ('0' + paramId).slice(-1);
        this.iteratePassiveSkill(tagINDM, function (metaData) {
            var re = /(\d+)\,([-]?\d+)(%?)/i;
            var match = re.exec(metaData);
            if (match) {
                if (this.hpRate() <= Number(match[1]) * 0.01) {
                    if (match[3] === '%') {
                        var rate = Number(match[2]) * 0.01;
                        ret += Math.floor(baseParam * rate);
                    }
                    else {
                        ret += Number(match[2]);
                    }
                }
            }
        }.bind(this));
        return ret;
    };

    Game_Actor.prototype.paramBase = function (paramId) {
        var ret = this.paramBaseDirect(paramId);
        ret += this.paramBaseBoost(paramId);
        return ret;
    };

    var _Game_Actor_paramPlus = Game_Actor.prototype.paramPlus;
    Game_Actor.prototype.paramPlusDirect = function (paramId) {
        return _Game_Actor_paramPlus.call(this, paramId);
    };

    Game_Actor.prototype.paramPlusBoost = function (paramId) {
        var ret = 0;
        this.equips().forEach(function (item) {
            if (item) {
                if (DataManager.isWeapon(item)) {
                    var tag = 'passiveWPNM' + ('00' + item.wtypeId).slice(-2);
                    this.iteratePassiveSkill(tag, function (metaData) {
                        if (item.params[paramId] > 0) {
                            ret += Utility.calcParamBoost(item.params[paramId], metaData);
                        }
                    });
                }
                else if (DataManager.isArmor(item)) {
                    var tag = 'passiveARMM' + ('00' + item.atypeId).slice(-2);
                    this.iteratePassiveSkill(tag, function (metaData) {
                        if (item.params[paramId] > 0) {
                            ret += Utility.calcParamBoost(item.params[paramId], metaData);
                        }
                    });
                }
            }
        }, this);
        return ret;
    };

    Game_Actor.prototype.paramPlus = function (paramId) {
        var ret = this.paramPlusDirect(paramId);
        ret += this.paramPlusBoost(paramId);
        return ret;
    };

    var _Game_Actor_xparam = Game_Actor.prototype.xparam;
    Game_Actor.prototype.xparamDirect = function (xparamId) {
        return _Game_Actor_xparam.call(this, xparamId);
    };

    Game_Actor.prototype.xparam = function (xparamId) {
        var ret = this.xparamDirect(xparamId);
        var tagPBST = 'passiveXPBST' + ('0' + xparamId).slice(-1);
        this.iteratePassiveSkill(tagPBST, function (metaData) {
            ret += Utility.calcXParamBoost(metaData);
        });
        var tagPBSTEX = 'passiveXPBSTEX' + ('0' + xparamId).slice(-1);
        this.iteratePassiveSkill(tagPBSTEX, function (metaData) {
            var splitData = metaData.split(',');
            if (this.evaluateCondition(splitData[1], Number(splitData[2]))) {
                ret += Utility.calcXParamBoost(splitData[0]);
            }
        }.bind(this));
        var tagINDM = 'passiveXINDM' + ('0' + xparamId).slice(-1);
        this.iteratePassiveSkill(tagINDM, function (metaData) {
            var re = /(\d+)\,([-]?\d+)/i;
            var match = re.exec(metaData);
            if (match) {
                if (this.hpRate() <= Number(match[1]) * 0.01) {
                    ret += Number(match[2]) * 0.01;
                }
            }
        }.bind(this));
        return ret;
    };

    var _Game_Actor_sparam = Game_Actor.prototype.sparam;
    Game_Actor.prototype.sparamDirect = function (sparamId) {
        return _Game_Actor_sparam.call(this, sparamId);
    };

    Game_Actor.prototype.sparam = function (sparamId) {
        var ret = this.sparamDirect(sparamId);
        var tagPBST = 'passiveSPBST' + ('0' + sparamId).slice(-1);
        this.iteratePassiveSkill(tagPBST, function (metaData) {
            ret += Utility.calcSParamBoost(metaData);
        });
        var tagPBSTEX = 'passiveSPBSTEX' + ('0' + sparamId).slice(-1);
        this.iteratePassiveSkill(tagPBSTEX, function (metaData) {
            var splitData = metaData.split(',');
            if (this.evaluateCondition(splitData[1], Number(splitData[2]))) {
                ret += Utility.calcSParamBoost(splitData[0]);
            }
        }.bind(this));
        var tagINDM = 'passiveSINDM' + ('0' + sparamId).slice(-1);
        this.iteratePassiveSkill(tagINDM, function (metaData) {
            var re = /(\d+)\,([-]?\d+)/i;
            var match = re.exec(metaData);
            if (match) {
                if (this.hpRate() <= Number(match[1]) * 0.01) {
                    ret += Number(match[2]) * 0.01;
                }
            }
        }.bind(this));
        return ret;
    };

    var _Game_Actor_elementRate = Game_Actor.prototype.elementRate;
    Game_Actor.prototype.elementRate = function (elementId) {
        var ret = _Game_Actor_elementRate.call(this, elementId);
        var tag = 'passiveELEM' + ('00' + elementId).slice(-2);
        this.iteratePassiveSkill(tag, function (metaData) {
            var re = /([-]?\d+)/i;
            var match = re.exec(metaData);
            if (match) {
                ret *= Number(match[1]) * 0.01;
            }
        });
        return ret;
    };

    var _Game_Actor_stateRate = Game_Actor.prototype.stateRate;
    Game_Actor.prototype.stateRate = function (stateId) {
        var ret = _Game_Actor_stateRate.call(this, stateId);
        var tag = 'passiveSTAT' + ('0000' + stateId).slice(-4);
        this.iteratePassiveSkill(tag, function (metaData) {
            var re = /([-]?\d+)/i;
            var match = re.exec(metaData);
            if (match) {
                ret *= Number(match[1]) * 0.01;
            }
        });
        return ret;
    };

    var _Game_Actor_stateResistSet = Game_Actor.prototype.stateResistSet;
    Game_Actor.prototype.stateResistSet = function () {
        var ret = _Game_Actor_stateResistSet.call(this);
        var num = $dataStates.length;
        for (var ii = 1; ii < num; ii++) {
            var tag = 'passiveSTREG' + ('0000' + ii).slice(-4);
            this.iteratePassiveSkill(tag, function (metaData) {
                if (!ret.contains(ii)) {
                    ret.push(ii);
                }
            });
        }
        return ret;
    };

    var _Game_Actor_attackStates = Game_Actor.prototype.attackStates;
    Game_Actor.prototype.attackStates = function () {
        var ret = _Game_Actor_attackStates.call(this);
        var num = $dataStates.length;
        for (var ii = 1; ii < num; ii++) {
            var tag = 'passiveATKST' + ('0000' + ii).slice(-4);
            this.iteratePassiveSkill(tag, function (metaData) {
                if (!ret.contains(ii)) {
                    ret.push(ii);
                }
            });
        }
        return ret;
    };

    var _Game_Actor_attackStatesRate = Game_Actor.prototype.attackStatesRate;
    Game_Actor.prototype.attackStatesRate = function (stateId) {
        var ret = _Game_Actor_attackStatesRate.call(this, stateId);
        var tag = 'passiveATKST' + ('0000' + stateId).slice(-4);
        this.iteratePassiveSkill(tag, function (metaData) {
            var re = /([-]?\d+)/i;
            var match = re.exec(metaData);
            if (match) {
                ret += Number(match[1]) * 0.01;
            }
        });
        return ret;
    };

    var _Game_Actor_addedSkillTypes = Game_Actor.prototype.addedSkillTypes;
    Game_Actor.prototype.addedSkillTypes = function () {
        var ret = _Game_Actor_addedSkillTypes.call(this);
        var skillTypesMax = $dataSystem.skillTypes.length;
        for (var ii = 1; ii < skillTypesMax; ii++) {
            if (ret.indexOf(ii) < 0) {
                var tag = 'passiveAST' + ('00' + ii).slice(-2);
                var find = false;
                this.iteratePassiveSkill(tag, function (metaData) {
                    find = true;
                });
                if (find) {
                    ret.push(ii);
                }
            }
        }
        return ret;
    };

    var _Game_Actor_isEquipWtypeOk = Game_Actor.prototype.isEquipWtypeOk;
    Game_Actor.prototype.isEquipWtypeOk = function (wtypeId) {
        var ret = _Game_Actor_isEquipWtypeOk.call(this, wtypeId);
        var tag = 'passiveEWPN' + ('00' + wtypeId).slice(-2);
        this.iteratePassiveSkill(tag, function (metaData) {
            ret = true;
        });
        return ret;
    };

    var _Game_Actor_isEquipAtypeOk = Game_Actor.prototype.isEquipAtypeOk;
    Game_Actor.prototype.isEquipAtypeOk = function (atypeId) {
        var ret = _Game_Actor_isEquipAtypeOk.call(this, atypeId);
        var tag = 'passiveEARM' + ('00' + atypeId).slice(-2);
        this.iteratePassiveSkill(tag, function (metaData) {
            ret = true;
        });
        return ret;
    };

    var _Game_Actor_actionPlusSet = Game_Actor.prototype.actionPlusSet;
    Game_Actor.prototype.actionPlusSet = function () {
        var ret = _Game_Actor_actionPlusSet.call(this);
        var tag = 'passiveAPLUS';
        this.iteratePassiveSkill(tag, function (metaData) {
            var re = /(\d+)/i;
            var match = re.exec(metaData);
            if (match) {
                ret.push(Number(match[1]) * 0.01);
            }
        });
        return ret;
    };

    var _Game_Actor_isAutoBattle = Game_Actor.prototype.isAutoBattle;
    Game_Actor.prototype.isAutoBattle = function () {
        var ret = _Game_Actor_isAutoBattle.call(this);
        var tag = 'passiveAUTO';
        this.iteratePassiveSkill(tag, function (metaData) {
            ret = true;
        });
        return ret;
    };

    var _Game_Actor_isGuard = Game_Actor.prototype.isGuard;
    Game_Actor.prototype.isGuard = function () {
        var ret = _Game_Actor_isGuard.call(this);
        var tag = 'passiveGUARD';
        this.iteratePassiveSkill(tag, function (metaData) {
            ret = true;
        });
        return ret;
    };

    var _Game_Actor_isSubstitute = Game_Actor.prototype.isSubstitute;
    Game_Actor.prototype.isSubstitute = function () {
        var ret = _Game_Actor_isSubstitute.call(this);
        var tag = 'passiveSUBS';
        this.iteratePassiveSkill(tag, function (metaData) {
            ret = true;
        });
        return ret;
    };

    var _Game_Actor_isPreserveTp = Game_Actor.prototype.isPreserveTp;
    Game_Actor.prototype.isPreserveTp = function (flagId) {
        var ret = _Game_Actor_isPreserveTp.call(this);
        var tag = 'passivePRETP';
        this.iteratePassiveSkill(tag, function (metaData) {
            ret = true;
        });
        return ret;
    };

    var _Game_Actor_maxTp = Game_Actor.prototype.maxTp;
    Game_Actor.prototype.maxTp = function () {
        var ret = _Game_Actor_maxTp.call(this);
        this.iteratePassiveSkill('passiveEXTTP', function (metaData) {
            ret += Number(metaData);
        });
        return ret;
    };
    //--------------------------------------------------------------------------
    /** Game_Action */
    var _Game_Action_executeDamage = Game_Action.prototype.executeDamage;
    Game_Action.prototype.executeDamage = function (target, value) {
        value = this.applyPassiveElementRate(value);
        value = this.applyPassiveHealRate(value);
        _Game_Action_executeDamage.call(this, target, value);
    };

    Game_Action.prototype.applyPassiveElementRate = function (value) {
        var ret = value;
        if (this.subject().isActor()) {
            var tag = 'passiveELUP' + ('00' + this.item().damage.elementId).slice(-2);
            this.subject().iteratePassiveSkill(tag, function (metaData) {
                var re = /([-]?\d+)/i;
                var match = re.exec(metaData);
                if (match) {
                    ret = Number(match[1]) <= -100 ? 0 : Math.floor(ret * (1 + Number(match[1]) * 0.01));
                }
            });
        }
        return ret;
    };

    Game_Action.prototype.applyPassiveHealRate = function (value) {
        var ret = value;
        if (value < 0 && this.subject().isActor()) {
            this.subject().iteratePassiveSkill('passiveHEUP', function (metaData) {
                ret *= (1 + Number(metaData) * 0.01);
            });
        }
        return ret;
    };
    //--------------------------------------------------------------------------
    /** Game_Party */
    var _Game_Party_ratePreemptive = Game_Party.prototype.ratePreemptive;
    Game_Party.prototype.ratePreemptive = function (troopAgi) {
        var rate = _Game_Party_ratePreemptive.call(this, troopAgi);
        this.battleMembers().some(function (actor) {
            actor.iteratePassiveSkill('passivePREE', function (metaData) {
                rate += Number(metaData) * 0.01;
            });
        });
        return rate.clamp(0.0, 1.0);
    };

    var _Game_Party_rateSurprise = Game_Party.prototype.rateSurprise;
    Game_Party.prototype.rateSurprise = function (troopAgi) {
        var rate = _Game_Party_rateSurprise.call(this, troopAgi);
        this.battleMembers().some(function (actor) {
            actor.iteratePassiveSkill('passiveASUP', function (metaData) {
                rate -= Number(metaData) * 0.01 * rate;
            });
        });
        return rate.clamp(0.0, 1.0);
    };

    Game_Troop.prototype.goldTotal = function () {
        var rate = 1;
        $gameParty.battleMembers().some(function (actor) {
            actor.iteratePassiveSkill('passiveGRUP', function (metaData) {
                rate += Number(metaData) * 0.01 * rate;
            });
        });
        return Math.floor(this.deadMembers().reduce(function (r, enemy) {
            return r + enemy.gold()*rate;
        }, 0) * this.goldRate());
    };

    Game_Enemy.prototype.makeDropItems = function () {
        var rate = 1;
        $gameParty.battleMembers().some(function (actor) {
            actor.iteratePassiveSkill('passiveIRUP', function (metaData) {
                rate += Number(metaData) * 0.01 * rate;
            });
        });
        return this.enemy().dropItems.reduce(function (r, di) {
            if (di.kind > 0 && Math.random() * di.denominator < this.dropItemRate()*rate) {
                return r.concat(this.itemObject(di.kind, di.dataId));
            } else {
                return r;
            }
        }.bind(this), []);
    };
    //--------------------------------------------------------------------------
    /** Window_ActorCommand */
    Window_ActorCommand.prototype.addSkillCommands = function () {
        var skillTypes = this._actor.addedSkillTypes();
        skillTypes.sort(function (a, b) {
            return a - b;
        });
        skillTypes.forEach(function (stypeId) {
            if (stypeId != dsPassiveSkill.parameters.hide) {
                var name = $dataSystem.skillTypes[stypeId];
                this.addCommand(name, 'skill', true, stypeId);
            }
        }, this);
    };

}((this.dsPassiveSkill = this.dsPassiveSkill || {})));