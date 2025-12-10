// 从Excel提取的固定系数

let previousDamage = null;

function calculateDamage() {
    // 获取输入值
    const inputs = {
        baseAttack: parseFloat(document.getElementById('baseAttack').value),
        pctAttack: parseFloat(document.getElementById('pctAttack').value),
        fixAttack: parseFloat(document.getElementById('fixAttack').value),
        critValue: parseFloat(document.getElementById('critValue').value),
        critresist: parseFloat(document.getElementById('critresist').value),
        critnum: parseFloat(document.getElementById('critnum').value),
        baseSG: parseFloat(document.getElementById('baseSG').value),
        tempSG: parseFloat(document.getElementById('tempSG').value),
        hjct: parseFloat(document.getElementById('hjct').value),
        gwhj: parseFloat(document.getElementById('gwhj').value),
        ysct: parseFloat(document.getElementById('ysct').value),
        yskx: parseFloat(document.getElementById('yskx').value),
        slsh: parseFloat(document.getElementById('slsh').value),
        jnsh: parseFloat(document.getElementById('jnsh').value),
        yssh: parseFloat(document.getElementById('yssh').value),
        shjc: parseFloat(document.getElementById('shjc').value),
        ybys: parseFloat(document.getElementById('ybys').value),
        cwys: parseFloat(document.getElementById('cwys').value),
        ysys: parseFloat(document.getElementById('ysys').value),
        sxyz: parseFloat(document.getElementById('sxyz').value),
        kzzf: parseFloat(document.getElementById('kzzf').value),
        shzf: parseFloat(document.getElementById('shzf').value),

        // 其他输入字段...
    };

    // 计算各个乘区
    const gjqdxs = ((inputs.baseAttack * (1 + inputs.pctAttack) + inputs.fixAttack) / 700 + 1);//攻击强度系数
   // const critMultiplier = calculateCrit(inputs);
  //  const elementMultiplier = calculateElement(inputs);
    // 暴击伤害计算...

    function calculateValue(critValue) {
        if (critValue < 200) {
            return critValue / 400;
        } else if (critValue < 500) {
            return (critValue * 17) / 6000 - (critValue ** 2) / 600000;
        } else {
            return critValue / 500;
        }
    }
    
    const bjshxs =Math.min( (calculateValue(inputs.critValue)-inputs.critresist),1)*(inputs.critnum+150)/1000;


// 属攻乘区计算
   const sxgjxs = (inputs.baseSG + inputs.tempSG) / 700 + 1;


//元素乘区计算
function ysctValue(ysct, yskx) {
    if (ysct <= yskx) {
        return 1505 / (yskx - ysct + 1505);
    } else {
        return (ysct - yskx) / (ysct - yskx + 3992) + 1;
    }
}
  const ysctxs =ysctValue(inputs.ysct, inputs.yskx);

//护甲穿透计算
function hjctValue(hjct, gwhj) {
    return hjct < gwhj ? 1505 / (gwhj - hjct + 1505) : 1;
}
  const hjctxs =hjctValue(inputs.hjct, inputs.gwhj);

//首领伤害系数
  const slshxs= (inputs.slsh+1);

//技能伤害系数
  const jnshxs= (inputs.jnsh+1);

//元素伤害系数
  const ysshxs= (inputs.yssh+1);

//伤害加成系数
  const shjcxs= (inputs.shjc+1);

//易伤效果（一般+宠物易伤+元素易伤）
  const ysxgxs=(inputs.ybys+1)*(inputs.cwys+1)*(inputs.ysys+1);

//宝石三大属性
  const bssdsx=(inputs.sxyz+1)*(inputs.kzzf+1)*(inputs.shzf+1);

// 最终伤害计算
    const finalDamage = gjqdxs * bjshxs * sxgjxs * ysctxs * hjctxs * slshxs * ysshxs * shjcxs * jnshxs * ysxgxs * bssdsx;
    
    document.getElementById('damageResult').textContent = finalDamage.toFixed(4);

    // 计算并显示变化百分比
    if (previousDamage !== null) {
        const changePercent = ((finalDamage - previousDamage) / previousDamage) * 100;
        const changeText = changePercent >= 0 ? `提升了 ${changePercent.toFixed(2)}%` : `降低了 ${Math.abs(changePercent).toFixed(2)}%`;
        document.getElementById('damageChange').textContent = `与上次相比：${changeText}`;
    }

    // 更新上次伤害值
    previousDamage = finalDamage;
}

// 初始化默认值
window.onload = function() {
    calculateDamage();
};