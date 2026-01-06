module.exports = [
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
"[project]/swinguerworldpro/apps/web/pages/premium.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Premium
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$swinguerworldpro$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/swinguerworldpro/node_modules/.pnpm/next@16.1.1_react-dom@19.2.3_react@19.2.3__react@19.2.3/node_modules/next/router.js [ssr] (ecmascript)");
;
;
;
function Premium() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$swinguerworldpro$2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$1$2e$1_react$2d$dom$40$19$2e$2$2e$3_react$40$19$2e$2$2e$3_$5f$react$40$19$2e$2$2e$3$2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [plans, setPlans] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({});
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (!token) {
            router.push('/login');
            return;
        }
        setUser(JSON.parse(userData));
        fetchPlans();
    }, [
        router
    ]);
    const fetchPlans = async ()=>{
        try {
            const res = await fetch('http://localhost:3001/plans');
            const data = await res.json();
            setPlans(data);
        } catch (err) {
            console.error('Error:', err);
        }
    };
    const handleUpgrade = async (planName)=>{
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:3001/payment/create-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    plan: planName
                })
            });
            const data = await res.json();
            if (data.sessionId) {
                // En producción, usar Stripe checkout
                alert(`✅ En desarrollo: Plan ${planName} activado\n\nEn producción usarías Stripe Checkout.\n\nSession ID: ${data.sessionId}`);
                // Simular pago completado
                const verifyRes = await fetch('http://localhost:3001/payment/verify', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        sessionId: data.sessionId,
                        plan: planName
                    })
                });
                const verifyData = await verifyRes.json();
                if (verifyData.success) {
                    localStorage.setItem('user', JSON.stringify(verifyData.user));
                    alert(`✅ ¡Bienvenido al plan ${planName}!`);
                    router.push('/dashboard');
                }
            }
        } catch (err) {
            alert('Error al procesar el pago: ' + err.message);
        } finally{
            setLoading(false);
        }
    };
    if (!user) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
        children: "⏳ Cargando..."
    }, void 0, false, {
        fileName: "[project]/swinguerworldpro/apps/web/pages/premium.js",
        lineNumber: 80,
        columnNumber: 21
    }, this);
    const planOrder = [
        'FREE',
        'PRO',
        'ADVANCED',
        'ELITE',
        'DIAMOND'
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        style: {
            padding: '40px 20px',
            fontFamily: 'Arial',
            background: '#f9f9f9',
            minHeight: '100vh'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            style: {
                maxWidth: '1200px',
                margin: '0 auto'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                    style: {
                        textAlign: 'center',
                        marginBottom: '10px'
                    },
                    children: "💎 Planes Premium"
                }, void 0, false, {
                    fileName: "[project]/swinguerworldpro/apps/web/pages/premium.js",
                    lineNumber: 87,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                    style: {
                        textAlign: 'center',
                        color: '#666',
                        marginBottom: '40px'
                    },
                    children: [
                        "Tu plan actual: ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                            children: user.plan
                        }, void 0, false, {
                            fileName: "[project]/swinguerworldpro/apps/web/pages/premium.js",
                            lineNumber: 89,
                            columnNumber: 27
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/swinguerworldpro/apps/web/pages/premium.js",
                    lineNumber: 88,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '20px'
                    },
                    children: planOrder.map((planKey)=>{
                        const plan = plans[planKey];
                        if (!plan) return null;
                        const isCurrentPlan = user.plan === planKey;
                        const price = plan.price === 0 ? 'Gratis' : `$${(plan.price / 100).toFixed(2)}/mes`;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            style: {
                                border: isCurrentPlan ? '3px solid #007bff' : '1px solid #ddd',
                                borderRadius: '8px',
                                padding: '20px',
                                background: isCurrentPlan ? '#e7f3ff' : 'white',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                    style: {
                                        marginTop: 0
                                    },
                                    children: plan.name
                                }, void 0, false, {
                                    fileName: "[project]/swinguerworldpro/apps/web/pages/premium.js",
                                    lineNumber: 112,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: '24px',
                                        fontWeight: 'bold',
                                        color: '#007bff',
                                        marginBottom: '20px'
                                    },
                                    children: price
                                }, void 0, false, {
                                    fileName: "[project]/swinguerworldpro/apps/web/pages/premium.js",
                                    lineNumber: 113,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                                    style: {
                                        listStyle: 'none',
                                        padding: 0,
                                        marginBottom: '20px'
                                    },
                                    children: plan.features.map((feature, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                            style: {
                                                padding: '8px 0',
                                                borderBottom: '1px solid #eee'
                                            },
                                            children: [
                                                "✅ ",
                                                feature
                                            ]
                                        }, idx, true, {
                                            fileName: "[project]/swinguerworldpro/apps/web/pages/premium.js",
                                            lineNumber: 119,
                                            columnNumber: 21
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/swinguerworldpro/apps/web/pages/premium.js",
                                    lineNumber: 117,
                                    columnNumber: 17
                                }, this),
                                isCurrentPlan ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    disabled: true,
                                    style: {
                                        width: '100%',
                                        padding: '12px',
                                        background: '#28a745',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'default',
                                        fontWeight: 'bold'
                                    },
                                    children: "✅ Plan actual"
                                }, void 0, false, {
                                    fileName: "[project]/swinguerworldpro/apps/web/pages/premium.js",
                                    lineNumber: 126,
                                    columnNumber: 19
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: ()=>handleUpgrade(planKey),
                                    disabled: loading,
                                    style: {
                                        width: '100%',
                                        padding: '12px',
                                        background: loading ? '#ccc' : '#007bff',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: loading ? 'default' : 'pointer',
                                        fontWeight: 'bold'
                                    },
                                    children: loading ? 'Procesando...' : 'Actualizar'
                                }, void 0, false, {
                                    fileName: "[project]/swinguerworldpro/apps/web/pages/premium.js",
                                    lineNumber: 142,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, planKey, true, {
                            fileName: "[project]/swinguerworldpro/apps/web/pages/premium.js",
                            lineNumber: 105,
                            columnNumber: 15
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/swinguerworldpro/apps/web/pages/premium.js",
                    lineNumber: 92,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    style: {
                        marginTop: '40px',
                        textAlign: 'center'
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        onClick: ()=>router.push('/dashboard'),
                        style: {
                            padding: '12px 30px',
                            background: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '14px'
                        },
                        children: "Volver al dashboard"
                    }, void 0, false, {
                        fileName: "[project]/swinguerworldpro/apps/web/pages/premium.js",
                        lineNumber: 165,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/swinguerworldpro/apps/web/pages/premium.js",
                    lineNumber: 164,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/swinguerworldpro/apps/web/pages/premium.js",
            lineNumber: 86,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/swinguerworldpro/apps/web/pages/premium.js",
        lineNumber: 85,
        columnNumber: 5
    }, this);
}
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__97676b4e._.js.map