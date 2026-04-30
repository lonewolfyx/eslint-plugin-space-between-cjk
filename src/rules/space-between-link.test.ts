import type { InvalidTestCase, ValidTestCase } from 'eslint-vitest-rule-tester'
import markdown from '@eslint/markdown'
import { run as runRuleTester } from 'eslint-vitest-rule-tester'
import rule from './space-between-link.ts'

const valids: ValidTestCase[] = [
    '在 [指南](/guide) 中',
    '[入门指南](/guide/) 中',
    '查看 [入门指南](/guide/)',
]

const invalid: InvalidTestCase[] = [
    {
        code: '在[入门指南](/guide/)中，',
        output: '在 [入门指南](/guide/) 中，',
        errors: [{ messageId: 'before' }, { messageId: 'after' }],
    },
    {
        code: '在   [入门指南](/guide/)中，',
        output: '在 [入门指南](/guide/) 中，',
        errors: [{ messageId: 'before' }, { messageId: 'after' }],
    },
    {
        code: '在[入门指南](/guide/)   中，',
        output: '在 [入门指南](/guide/) 中，',
        errors: [{ messageId: 'before' }, { messageId: 'after' }],
    },
]

runRuleTester({
    name: 'space-between-link',
    rule,
    valid: valids,
    invalid,
    configs: {
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
    },
}).then()
