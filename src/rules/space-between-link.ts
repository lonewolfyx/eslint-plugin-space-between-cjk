import { createEslintRule } from '../utils.ts'

const ruleName = 'space-between-link'

const spaceRE = /[ \t\u00A0\u3000]/u
const lineRE = /[\r\n]/u

function rangeOf(node: any): [number, number] | null {
    const start = node.position?.start.offset
    const end = node.position?.end.offset

    return typeof start === 'number' && typeof end === 'number'
        ? [start, end]
        : null
}

export default createEslintRule({
    name: ruleName,
    meta: {
        type: 'layout',
        fixable: 'whitespace',
        docs: {
            description: 'enforce consistent spacing around markdown links',
        },
        schema: [],
        messages: {
            before: 'Markdown link 前方需要且只能保留一个空格。',
            after: 'Markdown link 后方需要且只能保留一个空格。',
        },
    },
    create(context) {
        const text = context.sourceCode.text

        function fixSpace(node: any, from: number, to: number, side: 'before' | 'after') {
            if (text.slice(from, to) === ' ')
                return

            context.report({
                node: node as never,
                messageId: side,
                fix: fixer => fixer.replaceTextRange([from, to], ' '),
            })
        }

        return {
            link(node: any) {
                const range = rangeOf(node)
                console.log(text, range)
                if (!range)
                    return

                const [start, end] = range

                let before = start
                while (before > 0 && spaceRE.test(text[before - 1]!))
                    before--

                let after = end
                while (after < text.length && spaceRE.test(text[after]!))
                    after++

                // 行首不强制补前置空格
                if (before > 0 && !lineRE.test(text[before - 1]!))
                    fixSpace(node, before, start, 'before')

                // 行尾不强制补后置空格
                if (after < text.length && !lineRE.test(text[after]!))
                    fixSpace(node, end, after, 'after')
            },
        }
    },
})
