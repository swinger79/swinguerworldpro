module.exports = [
"[externals]/styled-jsx/style.js [external] (styled-jsx/style.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("styled-jsx/style.js", () => require("styled-jsx/style.js"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/react-dom [external] (react-dom, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react-dom", () => require("react-dom"));

module.exports = mod;
}),
"[project]/swinguerworldpro/apps/web/pages/chat.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Chat
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/styled-jsx/style.js [external] (styled-jsx/style.js, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$swinguerworldpro$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/swinguerworldpro/node_modules/.pnpm/next@16.1.1_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/router.js [ssr] (ecmascript)");
;
;
;
;
function Chat() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$swinguerworldpro$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [newMessage, setNewMessage] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [onlineUsers, setOnlineUsers] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(0);
    const ws = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (!token) {
            router.push('/login');
            return;
        }
        const currentUser = JSON.parse(userData);
        setUser(currentUser);
        // Conectar WebSocket
        ws.current = new WebSocket('ws://localhost:3001');
        ws.current.onopen = ()=>{
            console.log('✅ WebSocket conectado');
            // Notificar que el usuario se unió
            ws.current.send(JSON.stringify({
                type: 'join',
                userId: currentUser.id,
                userName: currentUser.name
            }));
        };
        ws.current.onmessage = (event)=>{
            const data = JSON.parse(event.data);
            if (data.type === 'new_message') {
                setMessages((prev)=>[
                        ...prev,
                        data.data
                    ]);
            }
            if (data.type === 'user_joined') {
                console.log(`${data.userName} se conectó`);
            }
            if (data.type === 'user_left') {
                console.log('Un usuario se desconectó');
            }
        };
        return ()=>{
            ws.current?.close();
        };
    }, [
        router
    ]);
    const handleSendMessage = (e)=>{
        e.preventDefault();
        if (!newMessage.trim() || !user) return;
        ws.current.send(JSON.stringify({
            type: 'message',
            userId: user.id,
            userName: user.name,
            text: newMessage
        }));
        setNewMessage('');
    };
    if (!user) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
        children: "⏳ Cargando..."
    }, void 0, false, {
        fileName: "[project]/swinguerworldpro/apps/web/pages/chat.js",
        lineNumber: 72,
        columnNumber: 21
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            fontFamily: 'Arial'
        },
        className: "jsx-16cd18c68fc713b0",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    padding: '15px 20px',
                    background: '#007bff',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                },
                className: "jsx-16cd18c68fc713b0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                        className: "jsx-16cd18c68fc713b0",
                        children: "💬 Chat Global"
                    }, void 0, false, {
                        fileName: "[project]/swinguerworldpro/apps/web/pages/chat.js",
                        lineNumber: 90,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            localStorage.removeItem('token');
                            localStorage.removeItem('user');
                            router.push('/login');
                        },
                        style: {
                            padding: '8px 16px',
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        },
                        className: "jsx-16cd18c68fc713b0",
                        children: "Salir"
                    }, void 0, false, {
                        fileName: "[project]/swinguerworldpro/apps/web/pages/chat.js",
                        lineNumber: 91,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/swinguerworldpro/apps/web/pages/chat.js",
                lineNumber: 82,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1,
                    overflowY: 'auto',
                    padding: '20px',
                    background: '#f9f9f9'
                },
                className: "jsx-16cd18c68fc713b0",
                children: messages.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                    style: {
                        textAlign: 'center',
                        color: '#999'
                    },
                    className: "jsx-16cd18c68fc713b0",
                    children: "Sé el primero en enviar un mensaje 👋"
                }, void 0, false, {
                    fileName: "[project]/swinguerworldpro/apps/web/pages/chat.js",
                    lineNumber: 118,
                    columnNumber: 11
                }, this) : messages.map((msg)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        style: {
                            marginBottom: '15px',
                            display: 'flex',
                            gap: '10px',
                            animation: 'slideIn 0.3s ease'
                        },
                        className: "jsx-16cd18c68fc713b0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                src: msg.avatar,
                                alt: msg.userName,
                                style: {
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%'
                                },
                                className: "jsx-16cd18c68fc713b0"
                            }, void 0, false, {
                                fileName: "[project]/swinguerworldpro/apps/web/pages/chat.js",
                                lineNumber: 129,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "jsx-16cd18c68fc713b0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                        className: "jsx-16cd18c68fc713b0",
                                        children: msg.userName
                                    }, void 0, false, {
                                        fileName: "[project]/swinguerworldpro/apps/web/pages/chat.js",
                                        lineNumber: 139,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("br", {
                                        className: "jsx-16cd18c68fc713b0"
                                    }, void 0, false, {
                                        fileName: "[project]/swinguerworldpro/apps/web/pages/chat.js",
                                        lineNumber: 140,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            background: 'white',
                                            padding: '10px 15px',
                                            borderRadius: '8px',
                                            marginTop: '5px',
                                            maxWidth: '500px'
                                        },
                                        className: "jsx-16cd18c68fc713b0",
                                        children: msg.text
                                    }, void 0, false, {
                                        fileName: "[project]/swinguerworldpro/apps/web/pages/chat.js",
                                        lineNumber: 141,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("small", {
                                        style: {
                                            color: '#999'
                                        },
                                        className: "jsx-16cd18c68fc713b0",
                                        children: new Date(msg.timestamp).toLocaleTimeString()
                                    }, void 0, false, {
                                        fileName: "[project]/swinguerworldpro/apps/web/pages/chat.js",
                                        lineNumber: 150,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/swinguerworldpro/apps/web/pages/chat.js",
                                lineNumber: 138,
                                columnNumber: 15
                            }, this)
                        ]
                    }, msg.id, true, {
                        fileName: "[project]/swinguerworldpro/apps/web/pages/chat.js",
                        lineNumber: 123,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/swinguerworldpro/apps/web/pages/chat.js",
                lineNumber: 111,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                onSubmit: handleSendMessage,
                style: {
                    padding: '20px',
                    background: 'white',
                    borderTop: '1px solid #ddd',
                    display: 'flex',
                    gap: '10px'
                },
                className: "jsx-16cd18c68fc713b0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                        type: "text",
                        value: newMessage,
                        onChange: (e)=>setNewMessage(e.target.value),
                        placeholder: "Escribe un mensaje...",
                        style: {
                            flex: 1,
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            fontSize: '14px'
                        },
                        className: "jsx-16cd18c68fc713b0"
                    }, void 0, false, {
                        fileName: "[project]/swinguerworldpro/apps/web/pages/chat.js",
                        lineNumber: 167,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        type: "submit",
                        style: {
                            padding: '10px 20px',
                            background: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '14px'
                        },
                        className: "jsx-16cd18c68fc713b0",
                        children: "Enviar"
                    }, void 0, false, {
                        fileName: "[project]/swinguerworldpro/apps/web/pages/chat.js",
                        lineNumber: 180,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/swinguerworldpro/apps/web/pages/chat.js",
                lineNumber: 160,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__["default"], {
                id: "16cd18c68fc713b0",
                children: "@keyframes slideIn{0%{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/swinguerworldpro/apps/web/pages/chat.js",
        lineNumber: 75,
        columnNumber: 5
    }, this);
}
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0c946e17._.js.map