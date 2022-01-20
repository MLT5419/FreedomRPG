//=============================================================================
// Doka_DamageBoost.js
// by 多卡多卡 on 2019/7/20
//=============================================================================

/*:
 * @plugindesc 伤害加成 + 治疗量加成
 * @author 多卡多卡
 *
 * @help
 * 默认的物理伤害和魔法伤害只对角色受到的伤害有影响
 * 而默认的恢复效果和药理知识只对受到的治疗量有效果
 * 此插件能够实现主动效果
 *
 * 当角色拥有特定状态或装备有特定的装备时，可以增加/减少输出伤害
 * 对特定角色或特定职业也可以起效
 * 当然还可以对输出的治疗量造成影响
 * 除了技能，道具也可以进行调整
 * 当然负增幅就变成了减弱 _(:3」∠)_ 
 * 对敌人也可以适用相同的效果
 *
 * 如需转载或再次发布，请注明作者
 * -----------------------------------------------------------------------------
 * 在角色、职业、敌人、状态或装备的注释栏添加以下内容可以实现效果:
 *
 * 增加技能的元素伤害:
 * <SkillElementBoost[属性编号]:[增加量]>
 * [属性编号] - 增强技能伤害的元素属性(普通攻击:-1,无:00,物理:01)(数字)
 * [增加量]   - 增强技能伤害的百分比(数字)
 * 当增加量小于0时，则为减少伤害，并且增加量小于-100时，伤害将减为0
 * 注意:普通攻击为平A的伤害，并且属性为 -1 而不是 -01 !
 * 如果使用了Weapon Skill更改了平A的技能，
 * 更改的技能属性不为普通攻击时将不产生加成。
 * 例:技能攻击时造成的无属性伤害增加20%:
 * <SkillElementBoost00:20>
 *
 * 增加技能的治疗量:
 * <SkillHealBoost:[增加量]>
 * [增加量]   - 增加治疗量的百分比(数字)
 * 例:技能的治疗量增加20%:
 * <SkillHealBoost:20>
 *
 * 增加道具的元素伤害:
 * <ItemElementBoost[属性编号]:[增加量]>
 *
 * 增加道具的治疗量:
 * <ItemHealBoost[属性编号]:[增加量]>
 *
 * 增加治疗量:
 * <HealBoost[属性编号]:[增加量]>
 *
 * 增加物理技能的伤害:
 * <SkillPhysicalBoost:[增加量]>
 *
 * 增加魔法技能的伤害:
 * <SkillMagicalBoost:[增加量]>
 *
 * 增加技能伤害:
 * <SkillDamageBoost:[增加量]>
 *
 * 增加道具伤害:
 * <ItemDamageBoost:[增加量]>
 *
 * 增加伤害:
 * <DamageBoost:[增加量]>
 */

var Imported = Imported || {};
Imported.Doka_DamageBoost = true;
var Doka_DamageBoost = Doka_DamageBoost || {};

calcValue = function (rate, value) {
    return value *= (Number(rate) <= -100 ? 0 : (1 + Number(rate) * 0.01));
}

var Doka_Game_Action_executeDamage = Game_Action.prototype.executeDamage;
Game_Action.prototype.executeDamage = function (target, value) {
    value = this.damageBoost(value);
    Doka_Game_Action_executeDamage.call(this, target, value);
}

Game_Battler.prototype.notetags = function () {
    if (this.isEnemy()) { return this.enemy().note.split(/[\r\n]+/) };
    if (this.isActor()) { return this.actor().note.split(/[\r\n]+/) };
};

Game_Action.prototype.calcDamageBoost = function (tag, value) {
    var reg = /\<([A-Za-z]+[\d]*):([\d]+)\>/
    //这里不用正则就会报错，很迷
    this.subject().notetags().forEach(function (note)
    {
        var match = reg.exec(note);
        if (match && match[1] == tag)
            value = calcValue(match[2], value);
    });
    this.subject().states().forEach(function (state)
    {
        if (state.meta[tag] != undefined)
            value = calcValue(state.meta[tag], value);
    });
    if (this.subject().isActor())
    {
        if (this.subject().currentClass().meta[tag] != undefined)
            value = calcValue(this.subject().currentClass().meta[tag], value);
        this.subject().equips().forEach(function (equip)
        {
            if (equip != null && equip.meta[tag] != undefined)
                value = calcValue(equip.meta[tag], value);
        });
    }
    return Math.ceil(value);
}

Game_Action.prototype.damageBoost = function (value) {
    var ret = value;
    if (value >= 0)
    {
        if (this.isSkill())
        {
            var tag = 'SkillElementBoost' + ('00' + this.item().damage.elementId).slice(-2);
            ret = this.calcDamageBoost(tag, ret);
            ret = this.calcDamageBoost('SkillDamageBoost', ret);
            ret = this.calcDamageBoost('DamageBoost', ret);
        }
        if (this.isItem())
        {
            var tag = 'ItemElementBoost' + ('00' + this.item().damage.elementId).slice(-2);
            ret = this.calcDamageBoost(tag, ret);
            ret = this.calcDamageBoost('ItemDamageBoost', ret);
            ret = this.calcDamageBoost('DamageBoost', ret);
        }
        if (this.isPhysical())
            ret = this.calcDamageBoost('SkillPhysicalBoost', ret);
        else if (this.isMagical())
            ret = this.calcDamageBoost('SkillMagicalBoost', ret);
    }
    else if(value < 0)
    {
        if (this.isSkill())
        {
            ret = this.calcDamageBoost('SkillHealBoost', ret);
            ret = this.calcDamageBoost('HealBoost', ret);
        }
        if (this.isItem())
        {
            ret = this.calcDamageBoost('ItemHealBoost', ret);
            ret = this.calcDamageBoost('HealBoost', ret);
        }
    }
    return Math.ceil(ret);
}