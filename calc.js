// 伤害计算器 - 优化版

let previousDamage = null;
let savedConfigs = [];

// 从localStorage加载保存的配置
function loadSavedConfigs() {
    const saved = localStorage.getItem('damageCalcConfigs');
    if (saved) {
        savedConfigs = JSON.parse(saved);
        updateConfigList();
    }

    // 加载上次使用的配置
    const lastConfig = localStorage.getItem('damageCalcLastConfig');
    if (lastConfig) {
        applyConfig(JSON.parse(lastConfig));
    }
}

// 保存配置到localStorage
function saveConfigsToStorage() {
    localStorage.setItem('damageCalcConfigs', JSON.stringify(savedConfigs));
}

// 获取当前所有输入值
function getCurrentInputs() {
    return {
        baseAttack: parseFloat(document.getElementById('baseAttack').value) || 0,
        pctAttack: parseFloat(document.getElementById('pctAttack').value) || 0,
        fixAttack: parseFloat(document.getElementById('fixAttack').value) || 0,
        critValue: parseFloat(document.getElementById('critValue').value) || 750,
        critresist: parseFloat(document.getElementById('critresist').value) || 0,
        critnum: parseFloat(document.getElementById('critnum').value) || 0,
        baseSG: parseFloat(document.getElementById('baseSG').value) || 0,
        tempSG: parseFloat(document.getElementById('tempSG').value) || 0,
        hjct: parseFloat(document.getElementById('hjct').value) || 0,
        gwhj: parseFloat(document.getElementById('gwhj').value) || 0,
        ysct: parseFloat(document.getElementById('ysct').value) || 0,
        yskx: parseFloat(document.getElementById('yskx').value) || 0,
        slsh: parseFloat(document.getElementById('slsh').value) || 0,
        jnsh: parseFloat(document.getElementById('jnsh').value) || 0,
        yssh: parseFloat(document.getElementById('yssh').value) || 0,
        shjc: parseFloat(document.getElementById('shjc').value) || 0,
        ybys: parseFloat(document.getElementById('ybys').value) || 0,
        cwys: parseFloat(document.getElementById('cwys').value) || 0,
        ysys: parseFloat(document.getElementById('ysys').value) || 0,
        sxyz: parseFloat(document.getElementById('sxyz').value) || 0,
        kzzf: parseFloat(document.getElementById('kzzf').value) || 0,
        shzf: parseFloat(document.getElementById('shzf').value) || 0
    };
}

// 应用配置到输入框
function applyConfig(config) {
    Object.keys(config).forEach(key => {
        const input = document.getElementById(key);
        if (input) {
            input.value = config[key];
        }
    });
    localStorage.setItem('damageCalcLastConfig', JSON.stringify(config));
    calculateDamage();
}

// 保存当前配置
function saveCurrentConfig() {
    const name = prompt('请输入配置名称：');
    if (name) {
        const config = getCurrentInputs();
        config.name = name;
        config.id = Date.now();
        savedConfigs.push(config);
        saveConfigsToStorage();
        updateConfigList();
    }
}

// 更新配置列表下拉框
function updateConfigList() {
    const select = document.getElementById('configSelect');
    if (!select) return;

    select.innerHTML = '<option value="">-- 选择配置 --</option>';
    savedConfigs.forEach(config => {
        const option = document.createElement('option');
        option.value = config.id;
        option.textContent = config.name;
        select.appendChild(option);
    });
}

// 加载选中的配置
function loadSelectedConfig() {
    const select = document.getElementById('configSelect');
    const id = parseInt(select.value);
    if (id) {
        const config = savedConfigs.find(c => c.id === id);
        if (config) {
            applyConfig(config);
        }
    }
}

// 删除选中的配置
function deleteSelectedConfig() {
    const select = document.getElementById('configSelect');
    const id = parseInt(select.value);
    if (id) {
        savedConfigs = savedConfigs.filter(c => c.id !== id);
        saveConfigsToStorage();
        updateConfigList();
        select.value = '';
    }
}

// 对比两个配置
function compareConfigs() {
    if (savedConfigs.length < 2) {
        alert('需要至少保存2个配置才能对比');
        return;
    }

    const select = document.getElementById('configSelect');
    const id = parseInt(select.value);
    if (!id) {
        alert('请先选择一个配置进行对比');
        return;
    }

    const currentConfig = getCurrentInputs();
    const selectedConfig = savedConfigs.find(c => c.id === id);

    // 临时应用选中配置计算
    applyConfig(selectedConfig);
    const selectedDamage = calculateDamage(true);

    // 恢复当前配置
    applyConfig(currentConfig);
    const currentDamage = calculateDamage(true);

    // 显示对比结果
    const diff = ((currentDamage - selectedDamage) / selectedDamage) * 100;
    const compareResult = document.getElementById('compareResult');
    compareResult.innerHTML = `
        <div>当前配置伤害: <strong>${currentDamage.toFixed(4)}</strong></div>
        <div>${selectedConfig.name}伤害: <strong>${selectedDamage.toFixed(4)}</strong></div>
        <div style="margin-top:8px;">差异: <strong style="color:${diff >= 0 ? '#059669' : '#dc2626'}">${diff >= 0 ? '+' : ''}${diff.toFixed(2)}%</strong></div>
    `;
}

// 重置所有输入
function resetInputs() {
    const defaults = {
        baseAttack: 0, pctAttack: 0, fixAttack: 0,
        critValue: 750, critresist: 0, critnum: 0,
        baseSG: 0, tempSG: 0, hjct: 0, gwhj: 0,
        ysct: 0, yskx: 0, slsh: 0, jnsh: 0,
        yssh: 0, shjc: 0, ybys: 0, cwys: 0,
        ysys: 0, sxyz: 0, kzzf: 0, shzf: 0
    };
    applyConfig(defaults);
    previousDamage = null;
    document.getElementById('damageChange').textContent = '';
    document.getElementById('damageChange').className = '';
    document.getElementById('compareResult').innerHTML = '';
}

// 暴击值计算函数
function calculateValue(critValue) {
    if (critValue < 200) {
        return critValue / 400;
    } else if (critValue < 500) {
        return (critValue * 17) / 6000 - (critValue ** 2) / 600000;
    } else {
        return critValue / 500;
    }
}

// 元素穿透计算
function ysctValue(ysct, yskx) {
    if (ysct <= yskx) {
        return 1505 / (yskx - ysct + 1505);
    } else {
        return (ysct - yskx) / (ysct - yskx + 3992) + 1;
    }
}

// 护甲穿透计算
function hjctValue(hjct, gwhj) {
    return hjct < gwhj ? 1505 / (gwhj - hjct + 1505) : 1;
}

// 主计算函数
function calculateDamage(returnOnly = false) {
    const inputs = getCurrentInputs();

    // 计算各个乘区
    const gjqdxs = ((inputs.baseAttack * (1 + inputs.pctAttack) + inputs.fixAttack) / 700 + 1);
    const bjshxs = Math.min((calculateValue(inputs.critValue) - inputs.critresist), 1) * (inputs.critnum + 150) / 1000;
    const sxgjxs = (inputs.baseSG + inputs.tempSG) / 700 + 1;
    const ysctxs = ysctValue(inputs.ysct, inputs.yskx);
    const hjctxs = hjctValue(inputs.hjct, inputs.gwhj);
    const slshxs = (inputs.slsh + 1);
    const jnshxs = (inputs.jnsh + 1);
    const ysshxs = (inputs.yssh + 1);
    const shjcxs = (inputs.shjc + 1);
    const ysxgxs = (inputs.ybys + 1) * (inputs.cwys + 1) * (inputs.ysys + 1);
    const bssdsx = (inputs.sxyz + 1) * (inputs.kzzf + 1) * (inputs.shzf + 1);

    // 最终伤害
    const finalDamage = gjqdxs * bjshxs * sxgjxs * ysctxs * hjctxs * slshxs * ysshxs * shjcxs * jnshxs * ysxgxs * bssdsx;

    if (returnOnly) {
        return finalDamage;
    }

    // 显示结果
    document.getElementById('damageResult').textContent = finalDamage.toFixed(4);

    // 显示各乘区详情
    const detailsHtml = `
        <div class="multiplier-grid">
            <div class="multiplier-item"><span>攻击系数</span><strong>${gjqdxs.toFixed(4)}</strong></div>
            <div class="multiplier-item"><span>暴击系数</span><strong>${bjshxs.toFixed(4)}</strong></div>
            <div class="multiplier-item"><span>属攻系数</span><strong>${sxgjxs.toFixed(4)}</strong></div>
            <div class="multiplier-item"><span>元素穿透</span><strong>${ysctxs.toFixed(4)}</strong></div>
            <div class="multiplier-item"><span>护甲穿透</span><strong>${hjctxs.toFixed(4)}</strong></div>
            <div class="multiplier-item"><span>首领伤害</span><strong>${slshxs.toFixed(4)}</strong></div>
            <div class="multiplier-item"><span>技能伤害</span><strong>${jnshxs.toFixed(4)}</strong></div>
            <div class="multiplier-item"><span>元素伤害</span><strong>${ysshxs.toFixed(4)}</strong></div>
            <div class="multiplier-item"><span>伤害加成</span><strong>${shjcxs.toFixed(4)}</strong></div>
            <div class="multiplier-item"><span>易伤效果</span><strong>${ysxgxs.toFixed(4)}</strong></div>
            <div class="multiplier-item"><span>宝石属性</span><strong>${bssdsx.toFixed(4)}</strong></div>
        </div>
    `;
    document.getElementById('multiplierDetails').innerHTML = detailsHtml;

    // 计算并显示变化百分比
    if (previousDamage !== null) {
        const changePercent = ((finalDamage - previousDamage) / previousDamage) * 100;
        const changeText = changePercent >= 0 ? `提升了 ${changePercent.toFixed(2)}%` : `降低了 ${Math.abs(changePercent).toFixed(2)}%`;
        const changeElement = document.getElementById('damageChange');
        changeElement.textContent = `与上次相比：${changeText}`;
        changeElement.className = changePercent >= 0 ? 'positive' : 'negative';
    }

    // 保存当前配置为上次使用
    localStorage.setItem('damageCalcLastConfig', JSON.stringify(inputs));

    previousDamage = finalDamage;
    return finalDamage;
}

// 初始化
window.onload = function() {
    // 加载保存的配置
    loadSavedConfigs();

    // 初始计算
    calculateDamage();

    // 为所有输入框添加实时计算监听
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('input', calculateDamage);
        input.addEventListener('change', calculateDamage);
    });

    // Enter键快捷计算
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            calculateDamage();
        }
    });
};