// import { createRuleTester } from 'eslint-vitest-rule-tester'
//
// describe('rule-name', () => {
//     const { valid } = createRuleTester({
//         name: 'rule-name',
//         rule,
//     })
//
//     it('valid case 1', () => {
//         valid('# 这是一个test')
//     })
// })

import markdown from '@eslint/markdown'
import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import rule from './space-between-cjk.ts'

RuleTester.describe = describe
RuleTester.it = it

const ruleTest = new RuleTester({
    language: 'markdown/commonmark',
    plugins: {
        markdown,
    },
    languageOptions: {
        parserOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
        },
    },
})

ruleTest.run('space-between-cjk', rule, {
    invalid: [
        {
            code: '# 这是一个asd',
            output: '# 这是一个 asd',
            errors: 1,
        },
    ],
    valid: [
        {
            code: '# 这是一个 sss',
        },
    ],
})
