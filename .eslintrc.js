//@logydice sp. z.o.o rights reserved
module.exports = {
	ignorePatterns: [
		'node_modules/',
		'build/',
		'*.min.js',
		'tests/**/*.test.js',
		'babel.config.js',
	],
	extends: [
		'expo',
		'plugin:@typescript-eslint/recommended',
		'plugin:react/recommended',
		'plugin:react-hooks/recommended',
		'prettier',
	],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'react', 'react-hooks', 'prettier'],
	env: {
		browser: true,
		node: true,
		es2021: true,
	},
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 12,
		sourceType: 'module',
	},
	settings: {
		react: {
			version: 'detect',
		},
	},
	rules: {
		'@typescript-eslint/typedef': [
			'error',
			{
				arrayDestructuring: true,
				arrowParameter: true,
				memberVariableDeclaration: true,
				objectDestructuring: true,
				parameter: true,
				propertyDeclaration: true,
				variableDeclaration: true,
			},
		],
		'@typescript-eslint/explicit-module-boundary-types': 'error',
		'@typescript-eslint/no-explicit-any': 'warn',
		'@typescript-eslint/no-unused-vars': 'error',
		'prettier/prettier': [
			'error',
			{
				endOfLine: 'auto',
				singleQuote: true,
				semi: true,
				trailingComma: 'es5',
				tabWidth: 4,
				useTabs: true,
			},
		],
		'react/jsx-uses-react': 'off',
		'react/react-in-jsx-scope': 'off',
		'react/prop-types': 'off',
		'react-hooks/rules-of-hooks': 'error',
		'react-hooks/exhaustive-deps': 'warn',
		'no-console': 'off',
		'prefer-const': 'error',
		'no-var': 'error',
		'no-implicit-globals': 'error',
	},
	overrides: [
		{
			files: ['*.ts', '*.tsx'],
			rules: {
				'no-undef': 'off',
			},
		},
	],
};
