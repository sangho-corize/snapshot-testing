import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import { diff } from 'jest-diff';

const BEFORE_DIR = path.join(process.cwd(), 'before');
const AFTER_DIR = path.join(process.cwd(), 'after');

interface ComparisonResult {
  filename: string;
  status: 'identical' | 'different' | 'missing';
  diff?: string;
}

function compareWithJestSnapshot(filename: string): ComparisonResult {
  const beforePath = path.join(BEFORE_DIR, filename);
  const afterPath = path.join(AFTER_DIR, filename);

  // Check if files exist
  if (!fs.existsSync(beforePath)) {
    return { filename, status: 'missing', diff: 'Before file not found' };
  }
  if (!fs.existsSync(afterPath)) {
    return { filename, status: 'missing', diff: 'After file not found' };
  }

  const beforeContent = fs.readFileSync(beforePath, 'utf-8');
  const afterContent = fs.readFileSync(afterPath, 'utf-8');

  if (beforeContent === afterContent) {
    return { filename, status: 'identical' };
  }

  // Compare raw content directly to preserve exact line positions
  const diffResult = diff(beforeContent, afterContent, {
    expand: false,
    contextLines: 3,
  });

  // Add line numbers and change counts
  const enhancedDiff = addLineNumbersAndCounts(diffResult || '');

  return { 
    filename, 
    status: 'different', 
    diff: enhancedDiff || 'Files are different' 
  };
}

function stripAnsi(str: string): string {
  // Remove ANSI escape codes  
  return str.replace(/\x1B\[[0-9;]*m/g, '');
}

function addLineNumbersAndCounts(diffOutput: string): string {
  if (!diffOutput) return '';

  const lines = diffOutput.split('\n');
  let beforeLineNum = 0;  // Line number in 'before' file
  let afterLineNum = 0;   // Line number in 'after' file
  let addedCount = 0;
  let removedCount = 0;
  const numberedLines: string[] = [];

  // Extract counts from header lines and add line numbers
  lines.forEach(line => {
    const stripped = stripAnsi(line);
    const trimmed = stripped.trim();
    
    // Skip header lines (- Expected or + Received)
    if (trimmed.startsWith('- Expected') || trimmed.startsWith('+ Received')) {
      numberedLines.push(chalk.gray(line));
      return;
    }

    // Skip empty lines
    if (trimmed === '') {
      numberedLines.push(line);
      return;
    }

    // Parse @@ markers to get starting line numbers
    // Format: @@ -1,11 +1,11 @@ means: before starts at line 1, after starts at line 1
    const chunkMatch = trimmed.match(/@@\s+-(\d+)(?:,\d+)?\s+\+(\d+)(?:,\d+)?\s+@@/);
    if (chunkMatch) {
      beforeLineNum = parseInt(chunkMatch[1], 10);
      afterLineNum = parseInt(chunkMatch[2], 10);
      numberedLines.push(chalk.gray(line));
      return;
    }

    // Count and color lines based on prefix with actual file line numbers
    if (trimmed.startsWith('-')) {
      removedCount++;
      // Strip existing colors and apply red to entire line
      numberedLines.push(chalk.red(beforeLineNum.toString().padStart(4) + ' ' + stripped));
      beforeLineNum++;
    } else if (trimmed.startsWith('+')) {
      addedCount++;
      // Strip existing colors and apply green to entire line
      numberedLines.push(chalk.green(afterLineNum.toString().padStart(4) + ' ' + stripped));
      afterLineNum++;
    } else {
      // Context lines (present in both files)
      numberedLines.push(chalk.gray(beforeLineNum.toString().padStart(4) + ' ' + stripped));
      beforeLineNum++;
      afterLineNum++;
    }
  });

  // Build enhanced output with change summary
  const summary = chalk.yellow(`\n  📊 Changes: ${chalk.red(`${removedCount} lines removed`)} | ${chalk.green(`${addedCount} lines added`)}\n`);
  
  return summary + numberedLines.join('\n');
}

function compareAllFiles(): void {
  console.log('\n🔍 Comparing API responses using Jest Snapshot: before/ vs after/\n');
  console.log('=' .repeat(60) + '\n');

  if (!fs.existsSync(BEFORE_DIR)) {
    console.error(chalk.red('❌ before/ directory not found'));
    console.error('   Run: npm run test:before first\n');
    process.exit(1);
  }

  if (!fs.existsSync(AFTER_DIR)) {
    console.error(chalk.red('❌ after/ directory not found'));
    console.error('   Run: npm run test:after to capture and compare\n');
    process.exit(1);
  }

  const beforeFiles = fs.readdirSync(BEFORE_DIR).filter(f => f.endsWith('.json'));
  
  if (beforeFiles.length === 0) {
    console.error(chalk.red('❌ No files in before/ directory\n'));
    process.exit(1);
  }

  let identicalCount = 0;
  let differentCount = 0;
  let missingCount = 0;

  beforeFiles.forEach(filename => {
    const result = compareWithJestSnapshot(filename);

    if (result.status === 'identical') {
      console.log(chalk.green(`✅ ${filename}: No changes`));
      identicalCount++;
    } else if (result.status === 'different') {
      console.log(chalk.yellow(`\n⚠️  ${filename}: CHANGED\n`));
      console.log(result.diff);
      differentCount++;
    } else {
      console.log(chalk.red(`❌ ${filename}: MISSING`));
      console.log(`   ${result.diff}\n`);
      missingCount++;
    }
  });

  console.log('=' .repeat(60) + '\n');
  console.log('📊 Comparison Summary:\n');
  console.log(`   ${chalk.green('Identical:')} ${identicalCount} files`);
  console.log(`   ${chalk.yellow('Changed:')}   ${differentCount} files`);
  console.log(`   ${chalk.red('Missing:')}   ${missingCount} files`);
  console.log(`   ${chalk.blue('Total:')}     ${beforeFiles.length} files\n`);

  if (differentCount > 0) {
    console.log(chalk.yellow('⚠️  API responses have changed!'));
    console.log('   Review the differences above.\n');
    process.exit(1);
  } else if (missingCount > 0) {
    console.log(chalk.red('❌ Some files are missing!\n'));
    process.exit(1);
  } else {
    console.log(chalk.green('✅ All API responses are identical!\n'));
    process.exit(0);
  }
}

compareAllFiles();
