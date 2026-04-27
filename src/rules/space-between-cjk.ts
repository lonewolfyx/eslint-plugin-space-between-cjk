import type { Rule } from 'eslint'
import { version } from '../../package.json' with { type: 'json' }

type RuleModule = Rule.RuleModule
type RuleContext = Rule.RuleContext
type RuleListener = Rule.RuleListener

export default {
    meta: {
        name: 'eslint-plugin-space-between-cjk',
        version,
        docs: {
            description: '中英文之间需要空格',
        },
        fixable: 'whitespace',
    },
    create(context: RuleContext): RuleListener {
        const isChn = (char: string) => /[\u4E00-\u9FA5]/.test(char)
        const isEng = (char: string) => /[a-z0-9]/i.test(char)

        return {
            'heading, paragraph, listItem': function (node: any) {
                const children = node.children || []

                for (let i = 0; i < children.length; i++) {
                    const current = children[i]
                    const next = children[i + 1]

                    // --- 1. 处理单个 Text 节点内部的复杂情况 ---
                    if (current.type === 'text') {
                        const original = current.value
                        const spaced = original
                            // A. 中英文/数字 之间加空格
                            .replace(/([\u4E00-\u9FA5])([a-z0-9])/gi, '$1 $2')
                            .replace(/([a-z0-9])([\u4E00-\u9FA5])/gi, '$1 $2')

                            // B. HelloWorld: 小写字母接大写字母
                            .replace(/([a-z])([A-Z])/g, '$1 $2')

                            // C. 全角引号与中文: “中文” -> “中文” (内侧不加), 汉“ -> 汉 “ (外侧加)
                            .replace(/([\u4E00-\u9FA5])([“‘])/g, '$1 $2')
                            .replace(/([”’])([\u4E00-\u9FA5])/g, '$1 $2')

                            // D. 半角括号: 只有外侧加空格 (中文( -> 中文 (, )中文 -> ) 中文)
                            // 注意这里使用了 [^\s] 的逻辑思路，但正则直接匹配更稳定
                            .replace(/([\u4E00-\u9FA5])(\()/g, '$1 $2')
                            .replace(/(\))([\u4E00-\u9FA5])/g, '$1 $2')

                        if (spaced !== original) {
                            context.report({
                                node: current,
                                message: '文本间距格式不规范',
                                fix: fixer => fixer.replaceText(current, spaced),
                            })
                        }
                    }

                    // --- 2. 处理跨节点边界 (例如: 中文`code`) ---
                    if (next) {
                        const charL = current.type === 'inlineCode' ? '`' : (current.value || '').slice(-1)
                        const charR = next.type === 'inlineCode' ? '`' : (next.value || '').charAt(0)

                        if (charL && charR) {
                            // 判定是否需要空格的逻辑：
                            // 1. 中文 + (英文/数字/inlineCode/左括号)
                            // 2. (英文/数字/inlineCode/右括号) + 中文
                            const needSpace
                                = (isChn(charL) && (isEng(charR) || charR === '`' || charR === '('))
                                    || ((isEng(charL) || charL === '`' || charL === ')') && isChn(charR))

                            // 只有在没空格且需要空格时才修复
                            if (needSpace && !charL.endsWith(' ') && !charR.startsWith(' ')) {
                                // 特殊处理：如果 current 是 text 且末尾已有空格，不处理
                                if (current.type === 'text' && current.value.endsWith(' '))
                                    continue
                                if (next.type === 'text' && next.value.startsWith(' '))
                                    continue

                                context.report({
                                    node: current,
                                    message: '节点间需要空格',
                                    fix: fixer => fixer.insertTextAfter(current, ' '),
                                })
                            }
                        }
                    }
                }
            },
        }
    },
} as RuleModule
