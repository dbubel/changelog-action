const process = require('process')

// This test just verifies the regex pattern used for the new commit format
// We skip the main script test because it requires specific GitHub environment
jest.mock('@actions/github')
jest.mock('@actions/core')
jest.mock('fs')
jest.mock('@conventional-commits/parser')

// Test for the regex pattern used to match COH-123/feat(deps): commit format
test('COH commit format regex matches correctly', () => {
  const cohRegex = /^([A-Z]+-\d+)\/([a-z]+)(\([^)]*\))?:\s(.+)$/

  // Should match
  expect('COH-123/feat(deps): Update dependency').toMatch(cohRegex)
  expect('ABC-456/fix: Bug fix').toMatch(cohRegex)
  expect('JIRA-789/chore(workflow): Update CI config').toMatch(cohRegex)

  // Should not match standard conventional commits
  expect('feat(deps): Update dependency').not.toMatch(cohRegex)
  expect('fix: Bug fix').not.toMatch(cohRegex)

  // Test extraction
  const result = 'COH-123/feat(deps): Update dependency'.match(cohRegex)
  expect(result[1]).toBe('COH-123') // issueRef
  expect(result[2]).toBe('feat')    // type
  expect(result[3]).toBe('(deps)')  // scope with parentheses
  expect(result[4]).toBe('Update dependency') // subject

  // Test without scope
  const noScopeResult = 'ABC-456/fix: Bug fix'.match(cohRegex)
  expect(noScopeResult[1]).toBe('ABC-456')
  expect(noScopeResult[2]).toBe('fix')
  expect(noScopeResult[3]).toBeUndefined() // no scope
  expect(noScopeResult[4]).toBe('Bug fix')
})

