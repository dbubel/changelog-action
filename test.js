// Test script to check different commit message formats

// Test different formats
const testCases = [
  { 
    name: "Standard COH format", 
    message: "COH-123/feat(deps): Update dependency",
    expectedMain: true,
    expectedAlt: true
  },
  { 
    name: "Standard conventional commit", 
    message: "feat(deps): Update dependency",
    expectedMain: false,
    expectedAlt: false
  },
  { 
    name: "Ticket in middle of message", 
    message: "Update COH-123 dependency version",
    expectedMain: false,
    expectedAlt: true
  },
  { 
    name: "Ticket at end of message", 
    message: "Update dependency version COH-123",
    expectedMain: false,
    expectedAlt: true
  },
  { 
    name: "Ticket with brackets", 
    message: "Update dependency [COH-123]",
    expectedMain: false,
    expectedAlt: true
  },
  { 
    name: "Ticket with parentheses", 
    message: "Update dependency (COH-123)",
    expectedMain: false,
    expectedAlt: true
  },
  { 
    name: "Multiple tickets", 
    message: "Fix issue COH-123 and update for COH-456",
    expectedMain: false,
    expectedAlt: true
  },
  { 
    name: "Malformed ticket", 
    message: "COH123/feat(deps): Missing hyphen",
    expectedMain: false,
    expectedAlt: false
  }
];

// Main regex for COH-123/feat pattern
const cohRegex = /^([A-Z]+-\d+)\/([a-z]+)(\([^)]*\))?:\s(.+)$/;

// Alternative regex to find ticket references anywhere in the message
const altTicketRegex = /\b([A-Z]+-\d+)\b/;

console.log("Testing commit message formats for ticket extraction:");
console.log("==================================================");

for (const test of testCases) {
  const cohMatch = test.message.match(cohRegex);
  const altMatch = test.message.match(altTicketRegex);
  
  const mainMatches = !!cohMatch;
  const altMatches = !!altMatch;
  
  const mainTicket = cohMatch ? cohMatch[1] : null;
  const altTicket = altMatch ? altMatch[1] : null;
  
  console.log(`Test: ${test.name}`);
  console.log(`Message: "${test.message}"`);
  console.log(`Primary pattern matches: ${mainMatches} (Expected: ${test.expectedMain})`);
  console.log(`Alternative pattern matches: ${altMatches} (Expected: ${test.expectedAlt})`);
  console.log(`Primary extracted ticket: ${mainTicket || "None"}`);
  console.log(`Alternative extracted ticket: ${altTicket || "None"}`);
  console.log("--------------------------------------------------");
}

// Test multiple tickets in one message
console.log("\nTesting multiple tickets in one message:");
console.log("==================================================");

const multiTicketMessage = "Fix for COH-123 and update related to COH-456";
let match;
const tickets = [];
const globalAltTicketRegex = /\b([A-Z]+-\d+)\b/g;

while ((match = globalAltTicketRegex.exec(multiTicketMessage)) !== null) {
  tickets.push(match[1]);
}

console.log(`Message: "${multiTicketMessage}"`);
console.log(`Found tickets: ${tickets.join(', ')}`);
console.log(`First ticket (which would be used): ${tickets[0] || "None"}`);
console.log("--------------------------------------------------");

// Test the second regex for invalid commits
console.log("\nTesting fallback regex for invalid conventional commits:");
console.log("==================================================");

const fallbackRegex = /^([A-Z]+-\d+)\/(.+)$/;
const fallbackTests = [
  { name: "Invalid but with ticket", message: "COH-123/This is not conventional format" },
  { name: "Multiple slashes", message: "COH-123/feat/not-conventional: Missing structure" },
  { name: "Wrong format but has ticket", message: "COH-123 - Some message without proper format" }
];

for (const test of fallbackTests) {
  const cohMatch = test.message.match(fallbackRegex);
  const matches = !!cohMatch;
  const ticketReference = cohMatch ? cohMatch[1] : null;
  
  console.log(`Test: ${test.name}`);
  console.log(`Message: "${test.message}"`);
  console.log(`Matches fallback: ${matches}`);
  console.log(`Extracted ticket: ${ticketReference || "None"}`);
  console.log("--------------------------------------------------");
}

// Test how the second fallback regex would handle conventional commit messages
console.log("\nTesting how fallback regex handles conventional commits:");
console.log("==================================================");

const conventionalTests = [
  { name: "Standard conventional", message: "feat(deps): Update dependency" },
  { name: "With PR reference", message: "fix: Bug fix (#123)" },
  { name: "Breaking change", message: "feat!: Breaking change with exclamation" }
];

for (const test of conventionalTests) {
  const cohMatch = test.message.match(fallbackRegex);
  const matches = !!cohMatch;
  const ticketReference = cohMatch ? cohMatch[1] : null;
  
  console.log(`Test: ${test.name}`);
  console.log(`Message: "${test.message}"`);
  console.log(`Would incorrectly match fallback: ${matches}`);
  console.log(`Extracted ticket: ${ticketReference || "None"}`);
  console.log("--------------------------------------------------");
} 