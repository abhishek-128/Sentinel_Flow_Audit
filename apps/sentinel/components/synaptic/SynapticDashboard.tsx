import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Layout } from '../Layout';

interface LogicMap {
    sourceFile: string;
    distillationEventId: string;
    nodes: { id: string; proposition: string }[];
}

export const SynapticDashboard: React.FC = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [logicMap, setLogicMap] = useState<LogicMap | null>(null);
    const [logs, setLogs] = useState<string[]>([]);
    const [uploadStatus, setUploadStatus] = useState<string | null>(null);
    const [metrics, setMetrics] = useState<{ latency: number; compression: number } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const nodeStyle = {
        background: '#1e293b',
        color: 'var(--synaptic)',
        border: '1px solid var(--synaptic)',
        borderRadius: '4px',
        padding: '12px',
        fontSize: '13px',
        fontWeight: 'bold',
        fontFamily: '"Courier New", Courier, monospace',
        boxShadow: '0 0 10px rgba(0, 255, 170, 0.2)',
        width: 250,
        wordWrap: 'break-word',
    };

    const addLog = (msg: string) => {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            setUploadStatus('Error: Only PDF files are supported.');
            return;
        }

        setIsProcessing(true);
        setUploadStatus('Uploading Document...');
        setLogicMap(null);
        setMetrics(null);
        setNodes([]);
        setEdges([]);
        setLogs([]);

        addLog(`INIT: Distillation requested for ${file.name}`);

        const formData = new FormData();
        formData.append('file', file);

        try {
            addLog('UPLOADING: Sending document to Synaptic Core on port 8001...');

            const startTime = performance.now();
            const response = await axios.post('http://localhost:8001/distill', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const endTime = performance.now();
            const latencySec = (endTime - startTime) / 1000;

            addLog('SUCCESS: Distillation complete. Parsing logic_map.json...');
            setUploadStatus('Distillation Successful!');

            const event_id = response.data.event_id;
            const returnedNodes = response.data.nodes || [];

            const newLogicMap: LogicMap = {
                sourceFile: file.name,
                distillationEventId: event_id,
                nodes: returnedNodes
            };

            // Calculate compression ratio (same heuristic as stress test: estimated 150 bytes per node)
            const compressedSizeEst = returnedNodes.length * 150;
            const ratio = file.size / Math.max(compressedSizeEst, 1);

            setLogicMap(newLogicMap);
            setMetrics({ latency: latencySec, compression: ratio });
            addLog(`MAPPED: Processed ${newLogicMap.nodes.length} distilled logic nodes.`);

            const initialNodes = newLogicMap.nodes.map((n, i) => ({
                id: n.id,
                position: { x: (i % 3) * 350 + 50, y: Math.floor(i / 3) * 200 + 50 },
                data: { label: n.proposition },
                style: nodeStyle
            }));

            // Create sequential edges connecting the distilled text flow
            const initialEdges = newLogicMap.nodes.slice(0, -1).map((n, i) => ({
                id: `e-${n.id}-${newLogicMap.nodes[i + 1].id}`,
                source: n.id,
                target: newLogicMap.nodes[i + 1].id,
                animated: true,
                style: { stroke: 'var(--synaptic)', strokeWidth: 2 },
                markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--synaptic)' },
            }));

            setNodes(initialNodes);
            setEdges(initialEdges);

        } catch (error: any) {
            console.error(error);
            setUploadStatus(`Upload failed: ${error.message}`);
            addLog(`ERROR: Connection to Synaptic Core failed. Check if port 8001 is running.`);
        } finally {
            setIsProcessing(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const resetDashboard = () => {
        window.scrollTo(0, 0);
        setNodes([]);
        setEdges([]);
        setLogicMap(null);
        setLogs([]);
        setMetrics(null);
        setUploadStatus(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        addLog('SYSTEM: Dashboard reset initiated.');
    };

    return (
        <Layout onReset={resetDashboard} systemName="SD" title="SYNAPTIC">
            <div style={{ display: 'flex', gap: '2rem', height: 'calc(100vh - 150px)' }}>
                {/* Left Column: Flow View & Controls */}
                <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="sf-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                background: isProcessing ? 'var(--synaptic)' : 'rgba(0, 255, 170, 0.1)',
                                color: isProcessing ? '#000' : 'var(--synaptic)',
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: '0.3s'
                            }}>
                                <svg style={{ width: '22px', height: '22px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.183.393V19a2 2 0 00.553 1.414l.33.33a2 2 0 001.414.553h9.388a2 2 0 001.414-.553l.33-.33A2 2 0 0019 19v-3.572a2 2 0 00-.572-1.414z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 12V3m0 0l3 3m-3-3L9 6" />
                                </svg>
                            </div>
                            <h2 className="mono" style={{ margin: 0, color: '#fff', textTransform: 'uppercase', fontStyle: 'italic', letterSpacing: '-0.02em', fontSize: '1.5rem', fontWeight: 800 }}>
                                Neural Logic Stream
                            </h2>
                        </div>

                        <div>
                            <input
                                type="file"
                                accept="application/pdf"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                style={{ display: 'none' }}
                                id="pdf-upload"
                            />
                            <label
                                htmlFor="pdf-upload"
                                className="sf-btn"
                                style={{
                                    cursor: isProcessing ? 'wait' : 'pointer',
                                    opacity: isProcessing ? 0.5 : 1,
                                    padding: '10px 20px',
                                    display: 'inline-block',
                                    background: 'var(--synaptic)',
                                    color: '#000',
                                    borderBottom: '6px solid #065f46'
                                }}
                            >
                                {isProcessing ? 'Distilling...' : 'Upload PDF'}
                            </label>
                        </div>
                    </div>

                    {uploadStatus && (
                        <div className="mono" style={{ fontSize: '12px', color: uploadStatus.includes('Error') || uploadStatus.includes('failed') ? '#f43f5e' : 'var(--synaptic)' }}>
                            Status: {uploadStatus}
                        </div>
                    )}

                    <div className="sf-card" style={{ flex: 1, padding: 0, overflow: 'hidden', position: 'relative' }}>
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            fitView
                            colorMode="dark"
                            style={{ backgroundColor: '#020617' }} // Matches layout background
                            proOptions={{ hideAttribution: true }}
                        >
                            <Background color="#1e293b" gap={20} size={1} />
                            <Controls />
                        </ReactFlow>
                    </div>
                </div>

                {/* Right Column: Audit Sync / Logging */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div className="sf-card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <h3 className="mono" style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#64748b', marginBottom: '1.5rem' }}>
                            Live Audit Sync
                        </h3>

                        <div style={{ flex: 1, backgroundColor: '#000', borderRadius: '4px', padding: '15px', overflowY: 'auto', border: '1px solid #334155' }}>
                            {logs.length === 0 ? (
                                <div className="mono" style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>Waiting for distillation events...</div>
                            ) : (
                                logs.map((log, i) => (
                                    <div key={i} className="mono" style={{
                                        fontSize: '11px',
                                        marginBottom: '8px',
                                        color: log.includes('ERROR') ? '#f43f5e' : log.includes('SUCCESS') ? '#10b981' : '#94a3b8'
                                    }}>
                                        {log}
                                    </div>
                                ))
                            )}
                        </div>

                        {logicMap && (
                            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #334155' }}>
                                <h4 className="mono" style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', marginBottom: '1rem' }}>Forensic Metrics</h4>

                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }} className="mono">
                                    <span style={{ opacity: 0.6 }}>Event ID</span>
                                    <span style={{ fontWeight: 800, color: 'var(--synaptic)' }}>{logicMap.distillationEventId}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }} className="mono">
                                    <span style={{ opacity: 0.6 }}>Logic Nodes</span>
                                    <span style={{ fontWeight: 800 }}>{logicMap.nodes.length} Extracted</span>
                                </div>

                                {metrics && (
                                    <>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }} className="mono">
                                            <span style={{ opacity: 0.6 }}>Distillation Latency</span>
                                            <span style={{ fontWeight: 800, color: '#10b981' }}>{metrics.latency.toFixed(2)}s</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }} className="mono">
                                            <span style={{ opacity: 0.6 }}>Compression Ratio</span>
                                            <span style={{ fontWeight: 800, color: 'var(--synaptic)' }}>{metrics.compression.toFixed(1)}x reduction</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};
