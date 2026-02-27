import React, { useState, useEffect, useCallback } from 'react';
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
import { useNavigate } from 'react-router-dom';

// Mock/Type for the incoming data
interface LogicMap {
    sourceFile: string;
    distillationEventId: string;
    nodes: { id: string; proposition: string }[];
}

export const SynapticView: React.FC = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
    const [progress, setProgress] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [logicMap, setLogicMap] = useState<LogicMap | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const navigate = useNavigate();

    // High-contrast custom node style
    const nodeStyle = {
        background: '#1A1A1A',
        color: '#00FFAA', // Neon Green on Dark
        border: '1px solid #00FFAA',
        borderRadius: '8px',
        padding: '12px',
        fontSize: '14px',
        fontWeight: 'bold',
        fontFamily: '"Courier New", Courier, monospace',
        boxShadow: '0 0 10px rgba(0, 255, 170, 0.3)',
        width: 280,
        wordWrap: 'break-word',
    };

    // Simulate a distillation event log fetch
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
                alert("Please upload a valid PDF document.");
                return;
            }
            setSelectedFile(file);
            processDocument(file);
        }
    };

    const processDocument = (file: File) => {
        setIsProcessing(true);
        setProgress(0);
        setLogicMap(null); // Clear previous map

        // Simulate real-time progress
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsProcessing(false);
                    loadGraphData(file.name);
                    return 100;
                }
                return prev + 10;
            });
        }, 200);
    };

    const loadGraphData = (filename: string) => {
        // In reality, we would fetch from the Docker Volume mapped endpoint
        const mockData: LogicMap = {
            sourceFile: filename,
            distillationEventId: "EVT-88902",
            nodes: [
                { id: "node_0", proposition: "Party A indemnifies Party B." },
                { id: "node_1", proposition: "Indemnification is capped at $1M." },
                { id: "node_2", proposition: "This clause survives termination." },
                { id: "node_3", proposition: "Exception: Gross negligence." }
            ]
        };

        setLogicMap(mockData);

        const initialNodes = mockData.nodes.map((n, i) => ({
            id: n.id,
            position: { x: 250, y: i * 120 + 50 },
            data: { label: n.proposition },
            style: nodeStyle
        }));

        // creating linear edges for visual flow
        const initialEdges = mockData.nodes.slice(0, -1).map((n, i) => ({
            id: `e-${n.id}-${mockData.nodes[i + 1].id}`,
            source: n.id,
            target: mockData.nodes[i + 1].id,
            animated: true,
            style: { stroke: '#FF0055', strokeWidth: 2 }, // Neon Pink edges
            markerEnd: {
                type: MarkerType.ArrowClosed,
                color: '#FF0055',
            },
        }));

        setNodes(initialNodes);
        setEdges(initialEdges);
    };

    return (
        <div style={{ height: '100vh', width: '100%', backgroundColor: '#0A0A0A', color: '#FFF', display: 'flex', flexDirection: 'column' }}>

            {/* Top Bar */}
            <div style={{ padding: '20px', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <button
                        onClick={() => navigate('/app')}
                        style={{
                            background: 'transparent',
                            color: '#888',
                            border: '1px solid #444',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}
                    >
                        <span>←</span> BACK TO SENTINEL
                    </button>
                    <div>
                        <h2 style={{ margin: 0, color: '#00FFAA', letterSpacing: '1px' }}>SYNAPTIC COMPRESSION DASHBOARD</h2>
                        <p style={{ margin: '5px 0 0 0', color: '#888', fontSize: '14px' }}>Real-time CDCL Distillation View</p>
                    </div>
                </div>

                <div>
                    <input
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                        id="pdf-upload"
                        disabled={isProcessing}
                    />
                    <label
                        htmlFor="pdf-upload"
                        style={{
                            backgroundColor: isProcessing ? '#333' : '#00FFAA',
                            color: isProcessing ? '#666' : '#000',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            cursor: isProcessing ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s',
                            display: 'inline-block'
                        }}
                    >
                        {isProcessing ? 'DISTILLING...' : 'UPLOAD PDF & AUDIT'}
                    </label>
                </div>
            </div>

            {/* Progress Bar Container */}
            <div style={{ height: '4px', backgroundColor: '#222', width: '100%' }}>
                <div
                    style={{
                        height: '100%',
                        width: `${progress}%`,
                        backgroundColor: '#00FFAA',
                        transition: 'width 0.2s ease-out',
                        boxShadow: '0 0 8px #00FFAA'
                    }}
                />
            </div>

            {/* Meta Data Panel */}
            {logicMap && (
                <div style={{ padding: '15px 20px', backgroundColor: '#111', fontSize: '13px', display: 'flex', gap: '30px', borderBottom: '1px solid #222' }}>
                    <div><span style={{ color: '#888' }}>SOURCE FILE:</span> <strong style={{ color: '#FFF' }}>{logicMap.sourceFile}</strong></div>
                    <div><span style={{ color: '#888' }}>EVENT ID:</span> <strong style={{ color: '#FFF' }}>{logicMap.distillationEventId}</strong></div>
                    <div><span style={{ color: '#888' }}>COMPRESSION RATIO:</span> <strong style={{ color: '#FF0055' }}>High</strong></div>
                </div>
            )}

            {/* Flow Body */}
            <div style={{ flex: 1, position: 'relative' }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    fitView
                    colorMode="dark"
                    style={{ backgroundColor: '#0A0A0A' }}
                >
                    <Background color="#222" gap={20} size={1} />
                    <Controls />
                </ReactFlow>
            </div>
        </div>
    );
};
