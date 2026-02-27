
import { AuditReport, AuditResult } from '../types';

export const generateMarkdownReport = (report: AuditReport): string => {
    const timestamp = new Date().toISOString();
    const integrityEmoji = report.overallIntegrityScore > 80 ? '🟢' : report.overallIntegrityScore > 50 ? '🟡' : '🔴';
    const complianceEmoji = report.abLabsCompliance === 'Pass' ? '✅' : '❌';

    let md = `# SENTINEL FLOW AUDITOR | FORENSIC REPORT\n`;
    md += `**Generated**: ${timestamp}\n`;
    md += `**Integrity Score**: ${integrityEmoji} ${report.overallIntegrityScore}%\n`;
    md += `**Compliance Status**: ${complianceEmoji} ${report.abLabsCompliance.toUpperCase()}\n\n`;

    md += `## 1. Executive Summary\n`;
    md += `${report.executiveSummary}\n\n`;

    md += `## 2. Session Metrics\n`;
    md += `| Metric | Value | Status |\n`;
    md += `| :--- | :--- | :--- |\n`;
    md += `| **Reasoning Health** | ${report.reasoningHealthScore}% | ${report.reasoningHealthScore > 70 ? 'Optimal' : 'Drift Detected'} |\n`;
    md += `| **Protocol Zero** | ${report.isLockdown ? 'TRIGGERED' : 'SECURE'} | ${report.isLockdown ? 'CRITICAL' : 'Normal'} |\n`;
    md += `| **Key Violations** | ${report.results.filter(r => r.complianceStatus === 'Axiom Violation').length} | -- |\n\n`;

    md += `## 3. Forensic Journal\n`;

    report.results.forEach((res, idx) => {
        const statusIcon = res.complianceStatus === 'Clean' ? '✅' : res.complianceStatus === 'Axiom Violation' ? '❌' : '⚠️';
        md += `### [${String(idx + 1).padStart(2, '0')}] ${res.timestamp}\n`;
        md += `**Status**: ${statusIcon} ${res.complianceStatus.toUpperCase()}\n`;
        md += `**Entry**: \`${res.logPreview}\`\n\n`;

        if (res.findings.length > 0) {
            md += `#### Findings:\n`;
            res.findings.forEach(f => {
                md += `- **${f.driftType}** (${f.severity})\n`;
                md += `  - *Evidence*: \`${f.evidence}\`\n`;
                md += `  - *Correction*: ${f.suggestedCorrection}\n`;
            });
            md += `\n`;
        }
        md += `---\n\n`;
    });

    if (report.isLockdown && report.lockdownArtifact) {
        md += `## 4. SYSTEM LOCKDOWN ARTIFACT\n`;
        md += `> **CRITICAL BREACH DETECTED**\n\n`;
        md += `**Violation Summary**: ${report.lockdownArtifact.violationSummary}\n\n`;
        md += `### Logic Trace\n`;
        md += '```plain\n';
        md += report.lockdownArtifact.logicTrace;
        md += '\n```\n';
        md += `\n**Countermeasure**: ${report.lockdownArtifact.recommendedCountermeasure}\n`;
    }

    md += `\n\n**© ${new Date().getFullYear()} AB LABS // SENTINEL FLOW AUDITOR**`;

    return md;
};
