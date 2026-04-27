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
    create(context: RuleContext) {
        return {
            heading(node: any) {
                for (const child of node.children as any[] || []) {
                    if (child.type === 'text' && typeof child.value === 'string') {
                        const original = child.value

                        const spaced = original
                            .replace(/([\u4E00-\u9FA5])([a-z0-9])/gi, '$1 $2')
                            .replace(/([a-z0-9])([\u4E00-\u9FA5])/gi, '$1 $2')

                        if (spaced !== original) {
                            context.report({
                                node,
                                message: '中英文之间应该有一个空格',
                                fix(fixer) {
                                    return fixer.replaceText(child, spaced)
                                },
                            })
                        }
                    }
                }
            },
        }
    },
} as RuleModule
