import type {
    RuleWithMetaAndName,
} from '@typescript-eslint/utils/eslint-utils'
import type { Rule } from 'eslint'
import {
    RuleCreator,
} from '@typescript-eslint/utils/eslint-utils'

const hasDocs = new Set([
    'eslint-plugin-space-between-cjk',
    'space-between-link',
])

const blobUrl = 'https://github.com/lonewolfyx/eslint-plugin-space-between-cjk/blob/main/docs/rules/'

export interface RuleModule<T extends readonly unknown[]>
    extends Rule.RuleModule {
    defaultOptions: T
}

export const createEslintRule = RuleCreator(ruleName =>
    hasDocs.has(ruleName)
        ? `${blobUrl}${ruleName}.md`
        : `${blobUrl}${ruleName}.test.ts`,
) as any as <TOptions extends readonly unknown[], TMessageIds extends string>({
    name,
    meta,
    ...rule
}: Readonly<RuleWithMetaAndName<TOptions, TMessageIds>>) => RuleModule<TOptions>
