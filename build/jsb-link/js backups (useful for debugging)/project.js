window.__require = function e(t, r, i) {
function n(s, f) {
if (!r[s]) {
if (!t[s]) {
var o = s.split("/");
o = o[o.length - 1];
if (!t[o]) {
var c = "function" == typeof __require && __require;
if (!f && c) return c(o, !0);
if (a) return a(o, !0);
throw new Error("Cannot find module '" + s + "'");
}
}
var h = r[s] = {
exports: {}
};
t[s][0].call(h.exports, function(e) {
return n(t[s][1][e] || e);
}, h, h.exports, e, t, r, i);
}
return r[s].exports;
}
for (var a = "function" == typeof __require && __require, s = 0; s < i.length; s++) n(i[s]);
return n;
}({
1: [ function(e, t, r) {
var i = r;
i.bignum = e("bn.js");
i.define = e("./asn1/api").define;
i.base = e("./asn1/base");
i.constants = e("./asn1/constants");
i.decoders = e("./asn1/decoders");
i.encoders = e("./asn1/encoders");
}, {
"./asn1/api": 2,
"./asn1/base": 4,
"./asn1/constants": 8,
"./asn1/decoders": 10,
"./asn1/encoders": 13,
"bn.js": 16
} ],
2: [ function(e, t, r) {
var i = e("../asn1"), n = e("inherits");
r.define = function(e, t) {
return new a(e, t);
};
function a(e, t) {
this.name = e;
this.body = t;
this.decoders = {};
this.encoders = {};
}
a.prototype._createNamed = function(t) {
var r;
try {
r = e("vm").runInThisContext("(function " + this.name + "(entity) {\n  this._initNamed(entity);\n})");
} catch (e) {
r = function(e) {
this._initNamed(e);
};
}
n(r, t);
r.prototype._initNamed = function(e) {
t.call(this, e);
};
return new r(this);
};
a.prototype._getDecoder = function(e) {
e = e || "der";
this.decoders.hasOwnProperty(e) || (this.decoders[e] = this._createNamed(i.decoders[e]));
return this.decoders[e];
};
a.prototype.decode = function(e, t, r) {
return this._getDecoder(t).decode(e, r);
};
a.prototype._getEncoder = function(e) {
e = e || "der";
this.encoders.hasOwnProperty(e) || (this.encoders[e] = this._createNamed(i.encoders[e]));
return this.encoders[e];
};
a.prototype.encode = function(e, t, r) {
return this._getEncoder(t).encode(e, r);
};
}, {
"../asn1": 1,
inherits: 101,
vm: 155
} ],
3: [ function(e, t, r) {
var i = e("inherits"), n = e("../base").Reporter, a = e("buffer").Buffer;
function s(e, t) {
n.call(this, t);
if (a.isBuffer(e)) {
this.base = e;
this.offset = 0;
this.length = e.length;
} else this.error("Input not Buffer");
}
i(s, n);
r.DecoderBuffer = s;
s.prototype.save = function() {
return {
offset: this.offset,
reporter: n.prototype.save.call(this)
};
};
s.prototype.restore = function(e) {
var t = new s(this.base);
t.offset = e.offset;
t.length = this.offset;
this.offset = e.offset;
n.prototype.restore.call(this, e.reporter);
return t;
};
s.prototype.isEmpty = function() {
return this.offset === this.length;
};
s.prototype.readUInt8 = function(e) {
return this.offset + 1 <= this.length ? this.base.readUInt8(this.offset++, !0) : this.error(e || "DecoderBuffer overrun");
};
s.prototype.skip = function(e, t) {
if (!(this.offset + e <= this.length)) return this.error(t || "DecoderBuffer overrun");
var r = new s(this.base);
r._reporterState = this._reporterState;
r.offset = this.offset;
r.length = this.offset + e;
this.offset += e;
return r;
};
s.prototype.raw = function(e) {
return this.base.slice(e ? e.offset : this.offset, this.length);
};
function f(e, t) {
if (Array.isArray(e)) {
this.length = 0;
this.value = e.map(function(e) {
e instanceof f || (e = new f(e, t));
this.length += e.length;
return e;
}, this);
} else if ("number" == typeof e) {
if (!(0 <= e && e <= 255)) return t.error("non-byte EncoderBuffer value");
this.value = e;
this.length = 1;
} else if ("string" == typeof e) {
this.value = e;
this.length = a.byteLength(e);
} else {
if (!a.isBuffer(e)) return t.error("Unsupported type: " + typeof e);
this.value = e;
this.length = e.length;
}
}
r.EncoderBuffer = f;
f.prototype.join = function(e, t) {
e || (e = new a(this.length));
t || (t = 0);
if (0 === this.length) return e;
if (Array.isArray(this.value)) this.value.forEach(function(r) {
r.join(e, t);
t += r.length;
}); else {
"number" == typeof this.value ? e[t] = this.value : "string" == typeof this.value ? e.write(this.value, t) : a.isBuffer(this.value) && this.value.copy(e, t);
t += this.length;
}
return e;
};
}, {
"../base": 4,
buffer: 47,
inherits: 101
} ],
4: [ function(e, t, r) {
var i = r;
i.Reporter = e("./reporter").Reporter;
i.DecoderBuffer = e("./buffer").DecoderBuffer;
i.EncoderBuffer = e("./buffer").EncoderBuffer;
i.Node = e("./node");
}, {
"./buffer": 3,
"./node": 5,
"./reporter": 6
} ],
5: [ function(e, t, r) {
var i = e("../base").Reporter, n = e("../base").EncoderBuffer, a = e("../base").DecoderBuffer, s = e("minimalistic-assert"), f = [ "seq", "seqof", "set", "setof", "objid", "bool", "gentime", "utctime", "null_", "enum", "int", "objDesc", "bitstr", "bmpstr", "charstr", "genstr", "graphstr", "ia5str", "iso646str", "numstr", "octstr", "printstr", "t61str", "unistr", "utf8str", "videostr" ], o = [ "key", "obj", "use", "optional", "explicit", "implicit", "def", "choice", "any", "contains" ].concat(f);
function c(e, t) {
var r = {};
this._baseState = r;
r.enc = e;
r.parent = t || null;
r.children = null;
r.tag = null;
r.args = null;
r.reverseArgs = null;
r.choice = null;
r.optional = !1;
r.any = !1;
r.obj = !1;
r.use = null;
r.useDecoder = null;
r.key = null;
r.default = null;
r.explicit = null;
r.implicit = null;
r.contains = null;
if (!r.parent) {
r.children = [];
this._wrap();
}
}
t.exports = c;
var h = [ "enc", "parent", "children", "tag", "args", "reverseArgs", "choice", "optional", "any", "obj", "use", "alteredUse", "key", "default", "explicit", "implicit", "contains" ];
c.prototype.clone = function() {
var e = this._baseState, t = {};
h.forEach(function(r) {
t[r] = e[r];
});
var r = new this.constructor(t.parent);
r._baseState = t;
return r;
};
c.prototype._wrap = function() {
var e = this._baseState;
o.forEach(function(t) {
this[t] = function() {
var r = new this.constructor(this);
e.children.push(r);
return r[t].apply(r, arguments);
};
}, this);
};
c.prototype._init = function(e) {
var t = this._baseState;
s(null === t.parent);
e.call(this);
t.children = t.children.filter(function(e) {
return e._baseState.parent === this;
}, this);
s.equal(t.children.length, 1, "Root node can have only one child");
};
c.prototype._useArgs = function(e) {
var t = this._baseState, r = e.filter(function(e) {
return e instanceof this.constructor;
}, this);
e = e.filter(function(e) {
return !(e instanceof this.constructor);
}, this);
if (0 !== r.length) {
s(null === t.children);
t.children = r;
r.forEach(function(e) {
e._baseState.parent = this;
}, this);
}
if (0 !== e.length) {
s(null === t.args);
t.args = e;
t.reverseArgs = e.map(function(e) {
if ("object" != typeof e || e.constructor !== Object) return e;
var t = {};
Object.keys(e).forEach(function(r) {
r == (0 | r) && (r |= 0);
var i = e[r];
t[i] = r;
});
return t;
});
}
};
[ "_peekTag", "_decodeTag", "_use", "_decodeStr", "_decodeObjid", "_decodeTime", "_decodeNull", "_decodeInt", "_decodeBool", "_decodeList", "_encodeComposite", "_encodeStr", "_encodeObjid", "_encodeTime", "_encodeNull", "_encodeInt", "_encodeBool" ].forEach(function(e) {
c.prototype[e] = function() {
var t = this._baseState;
throw new Error(e + " not implemented for encoding: " + t.enc);
};
});
f.forEach(function(e) {
c.prototype[e] = function() {
var t = this._baseState, r = Array.prototype.slice.call(arguments);
s(null === t.tag);
t.tag = e;
this._useArgs(r);
return this;
};
});
c.prototype.use = function(e) {
s(e);
var t = this._baseState;
s(null === t.use);
t.use = e;
return this;
};
c.prototype.optional = function() {
this._baseState.optional = !0;
return this;
};
c.prototype.def = function(e) {
var t = this._baseState;
s(null === t.default);
t.default = e;
t.optional = !0;
return this;
};
c.prototype.explicit = function(e) {
var t = this._baseState;
s(null === t.explicit && null === t.implicit);
t.explicit = e;
return this;
};
c.prototype.implicit = function(e) {
var t = this._baseState;
s(null === t.explicit && null === t.implicit);
t.implicit = e;
return this;
};
c.prototype.obj = function() {
var e = this._baseState, t = Array.prototype.slice.call(arguments);
e.obj = !0;
0 !== t.length && this._useArgs(t);
return this;
};
c.prototype.key = function(e) {
var t = this._baseState;
s(null === t.key);
t.key = e;
return this;
};
c.prototype.any = function() {
this._baseState.any = !0;
return this;
};
c.prototype.choice = function(e) {
var t = this._baseState;
s(null === t.choice);
t.choice = e;
this._useArgs(Object.keys(e).map(function(t) {
return e[t];
}));
return this;
};
c.prototype.contains = function(e) {
var t = this._baseState;
s(null === t.use);
t.contains = e;
return this;
};
c.prototype._decode = function(e, t) {
var r = this._baseState;
if (null === r.parent) return e.wrapResult(r.children[0]._decode(e, t));
var i, n = r.default, s = !0, f = null;
null !== r.key && (f = e.enterKey(r.key));
if (r.optional) {
var o = null;
null !== r.explicit ? o = r.explicit : null !== r.implicit ? o = r.implicit : null !== r.tag && (o = r.tag);
if (null !== o || r.any) {
s = this._peekTag(e, o, r.any);
if (e.isError(s)) return s;
} else {
var c = e.save();
try {
null === r.choice ? this._decodeGeneric(r.tag, e, t) : this._decodeChoice(e, t);
s = !0;
} catch (e) {
s = !1;
}
e.restore(c);
}
}
r.obj && s && (i = e.enterObject());
if (s) {
if (null !== r.explicit) {
var h = this._decodeTag(e, r.explicit);
if (e.isError(h)) return h;
e = h;
}
var d = e.offset;
if (null === r.use && null === r.choice) {
if (r.any) c = e.save();
var u = this._decodeTag(e, null !== r.implicit ? r.implicit : r.tag, r.any);
if (e.isError(u)) return u;
r.any ? n = e.raw(c) : e = u;
}
t && t.track && null !== r.tag && t.track(e.path(), d, e.length, "tagged");
t && t.track && null !== r.tag && t.track(e.path(), e.offset, e.length, "content");
n = r.any ? n : null === r.choice ? this._decodeGeneric(r.tag, e, t) : this._decodeChoice(e, t);
if (e.isError(n)) return n;
r.any || null !== r.choice || null === r.children || r.children.forEach(function(r) {
r._decode(e, t);
});
if (r.contains && ("octstr" === r.tag || "bitstr" === r.tag)) {
var l = new a(n);
n = this._getUse(r.contains, e._reporterState.obj)._decode(l, t);
}
}
r.obj && s && (n = e.leaveObject(i));
null === r.key || null === n && !0 !== s ? null !== f && e.exitKey(f) : e.leaveKey(f, r.key, n);
return n;
};
c.prototype._decodeGeneric = function(e, t, r) {
var i = this._baseState;
return "seq" === e || "set" === e ? null : "seqof" === e || "setof" === e ? this._decodeList(t, e, i.args[0], r) : /str$/.test(e) ? this._decodeStr(t, e, r) : "objid" === e && i.args ? this._decodeObjid(t, i.args[0], i.args[1], r) : "objid" === e ? this._decodeObjid(t, null, null, r) : "gentime" === e || "utctime" === e ? this._decodeTime(t, e, r) : "null_" === e ? this._decodeNull(t, r) : "bool" === e ? this._decodeBool(t, r) : "objDesc" === e ? this._decodeStr(t, e, r) : "int" === e || "enum" === e ? this._decodeInt(t, i.args && i.args[0], r) : null !== i.use ? this._getUse(i.use, t._reporterState.obj)._decode(t, r) : t.error("unknown tag: " + e);
};
c.prototype._getUse = function(e, t) {
var r = this._baseState;
r.useDecoder = this._use(e, t);
s(null === r.useDecoder._baseState.parent);
r.useDecoder = r.useDecoder._baseState.children[0];
if (r.implicit !== r.useDecoder._baseState.implicit) {
r.useDecoder = r.useDecoder.clone();
r.useDecoder._baseState.implicit = r.implicit;
}
return r.useDecoder;
};
c.prototype._decodeChoice = function(e, t) {
var r = this._baseState, i = null, n = !1;
Object.keys(r.choice).some(function(a) {
var s = e.save(), f = r.choice[a];
try {
var o = f._decode(e, t);
if (e.isError(o)) return !1;
i = {
type: a,
value: o
};
n = !0;
} catch (t) {
e.restore(s);
return !1;
}
return !0;
}, this);
return n ? i : e.error("Choice not matched");
};
c.prototype._createEncoderBuffer = function(e) {
return new n(e, this.reporter);
};
c.prototype._encode = function(e, t, r) {
var i = this._baseState;
if (null === i.default || i.default !== e) {
var n = this._encodeValue(e, t, r);
if (void 0 !== n && !this._skipDefault(n, t, r)) return n;
}
};
c.prototype._encodeValue = function(e, t, r) {
var n = this._baseState;
if (null === n.parent) return n.children[0]._encode(e, t || new i());
var a = null;
this.reporter = t;
if (n.optional && void 0 === e) {
if (null === n.default) return;
e = n.default;
}
var s = null, f = !1;
if (n.any) a = this._createEncoderBuffer(e); else if (n.choice) a = this._encodeChoice(e, t); else if (n.contains) {
s = this._getUse(n.contains, r)._encode(e, t);
f = !0;
} else if (n.children) {
s = n.children.map(function(r) {
if ("null_" === r._baseState.tag) return r._encode(null, t, e);
if (null === r._baseState.key) return t.error("Child should have a key");
var i = t.enterKey(r._baseState.key);
if ("object" != typeof e) return t.error("Child expected, but input is not object");
var n = r._encode(e[r._baseState.key], t, e);
t.leaveKey(i);
return n;
}, this).filter(function(e) {
return e;
});
s = this._createEncoderBuffer(s);
} else if ("seqof" === n.tag || "setof" === n.tag) {
if (!n.args || 1 !== n.args.length) return t.error("Too many args for : " + n.tag);
if (!Array.isArray(e)) return t.error("seqof/setof, but data is not Array");
var o = this.clone();
o._baseState.implicit = null;
s = this._createEncoderBuffer(e.map(function(r) {
var i = this._baseState;
return this._getUse(i.args[0], e)._encode(r, t);
}, o));
} else if (null !== n.use) a = this._getUse(n.use, r)._encode(e, t); else {
s = this._encodePrimitive(n.tag, e);
f = !0;
}
if (!n.any && null === n.choice) {
var c = null !== n.implicit ? n.implicit : n.tag, h = null === n.implicit ? "universal" : "context";
null === c ? null === n.use && t.error("Tag could be omitted only for .use()") : null === n.use && (a = this._encodeComposite(c, f, h, s));
}
null !== n.explicit && (a = this._encodeComposite(n.explicit, !1, "context", a));
return a;
};
c.prototype._encodeChoice = function(e, t) {
var r = this._baseState, i = r.choice[e.type];
i || s(!1, e.type + " not found in " + JSON.stringify(Object.keys(r.choice)));
return i._encode(e.value, t);
};
c.prototype._encodePrimitive = function(e, t) {
var r = this._baseState;
if (/str$/.test(e)) return this._encodeStr(t, e);
if ("objid" === e && r.args) return this._encodeObjid(t, r.reverseArgs[0], r.args[1]);
if ("objid" === e) return this._encodeObjid(t, null, null);
if ("gentime" === e || "utctime" === e) return this._encodeTime(t, e);
if ("null_" === e) return this._encodeNull();
if ("int" === e || "enum" === e) return this._encodeInt(t, r.args && r.reverseArgs[0]);
if ("bool" === e) return this._encodeBool(t);
if ("objDesc" === e) return this._encodeStr(t, e);
throw new Error("Unsupported tag: " + e);
};
c.prototype._isNumstr = function(e) {
return /^[0-9 ]*$/.test(e);
};
c.prototype._isPrintstr = function(e) {
return /^[A-Za-z0-9 '\(\)\+,\-\.\/:=\?]*$/.test(e);
};
}, {
"../base": 4,
"minimalistic-assert": 105
} ],
6: [ function(e, t, r) {
var i = e("inherits");
function n(e) {
this._reporterState = {
obj: null,
path: [],
options: e || {},
errors: []
};
}
r.Reporter = n;
n.prototype.isError = function(e) {
return e instanceof a;
};
n.prototype.save = function() {
var e = this._reporterState;
return {
obj: e.obj,
pathLen: e.path.length
};
};
n.prototype.restore = function(e) {
var t = this._reporterState;
t.obj = e.obj;
t.path = t.path.slice(0, e.pathLen);
};
n.prototype.enterKey = function(e) {
return this._reporterState.path.push(e);
};
n.prototype.exitKey = function(e) {
var t = this._reporterState;
t.path = t.path.slice(0, e - 1);
};
n.prototype.leaveKey = function(e, t, r) {
var i = this._reporterState;
this.exitKey(e);
null !== i.obj && (i.obj[t] = r);
};
n.prototype.path = function() {
return this._reporterState.path.join("/");
};
n.prototype.enterObject = function() {
var e = this._reporterState, t = e.obj;
e.obj = {};
return t;
};
n.prototype.leaveObject = function(e) {
var t = this._reporterState, r = t.obj;
t.obj = e;
return r;
};
n.prototype.error = function(e) {
var t, r = this._reporterState, i = e instanceof a;
t = i ? e : new a(r.path.map(function(e) {
return "[" + JSON.stringify(e) + "]";
}).join(""), e.message || e, e.stack);
if (!r.options.partial) throw t;
i || r.errors.push(t);
return t;
};
n.prototype.wrapResult = function(e) {
var t = this._reporterState;
return t.options.partial ? {
result: this.isError(e) ? null : e,
errors: t.errors
} : e;
};
function a(e, t) {
this.path = e;
this.rethrow(t);
}
i(a, Error);
a.prototype.rethrow = function(e) {
this.message = e + " at: " + (this.path || "(shallow)");
Error.captureStackTrace && Error.captureStackTrace(this, a);
if (!this.stack) try {
throw new Error(this.message);
} catch (e) {
this.stack = e.stack;
}
return this;
};
}, {
inherits: 101
} ],
7: [ function(e, t, r) {
var i = e("../constants");
r.tagClass = {
0: "universal",
1: "application",
2: "context",
3: "private"
};
r.tagClassByName = i._reverse(r.tagClass);
r.tag = {
0: "end",
1: "bool",
2: "int",
3: "bitstr",
4: "octstr",
5: "null_",
6: "objid",
7: "objDesc",
8: "external",
9: "real",
10: "enum",
11: "embed",
12: "utf8str",
13: "relativeOid",
16: "seq",
17: "set",
18: "numstr",
19: "printstr",
20: "t61str",
21: "videostr",
22: "ia5str",
23: "utctime",
24: "gentime",
25: "graphstr",
26: "iso646str",
27: "genstr",
28: "unistr",
29: "charstr",
30: "bmpstr"
};
r.tagByName = i._reverse(r.tag);
}, {
"../constants": 8
} ],
8: [ function(e, t, r) {
var i = r;
i._reverse = function(e) {
var t = {};
Object.keys(e).forEach(function(r) {
(0 | r) == r && (r |= 0);
var i = e[r];
t[i] = r;
});
return t;
};
i.der = e("./der");
}, {
"./der": 7
} ],
9: [ function(e, t, r) {
var i = e("inherits"), n = e("../../asn1"), a = n.base, s = n.bignum, f = n.constants.der;
function o(e) {
this.enc = "der";
this.name = e.name;
this.entity = e;
this.tree = new c();
this.tree._init(e.body);
}
t.exports = o;
o.prototype.decode = function(e, t) {
e instanceof a.DecoderBuffer || (e = new a.DecoderBuffer(e, t));
return this.tree._decode(e, t);
};
function c(e) {
a.Node.call(this, "der", e);
}
i(c, a.Node);
c.prototype._peekTag = function(e, t, r) {
if (e.isEmpty()) return !1;
var i = e.save(), n = h(e, 'Failed to peek tag: "' + t + '"');
if (e.isError(n)) return n;
e.restore(i);
return n.tag === t || n.tagStr === t || n.tagStr + "of" === t || r;
};
c.prototype._decodeTag = function(e, t, r) {
var i = h(e, 'Failed to decode tag of "' + t + '"');
if (e.isError(i)) return i;
var n = d(e, i.primitive, 'Failed to get length of "' + t + '"');
if (e.isError(n)) return n;
if (!r && i.tag !== t && i.tagStr !== t && i.tagStr + "of" !== t) return e.error('Failed to match tag: "' + t + '"');
if (i.primitive || null !== n) return e.skip(n, 'Failed to match body of: "' + t + '"');
var a = e.save(), s = this._skipUntilEnd(e, 'Failed to skip indefinite length body: "' + this.tag + '"');
if (e.isError(s)) return s;
n = e.offset - a.offset;
e.restore(a);
return e.skip(n, 'Failed to match body of: "' + t + '"');
};
c.prototype._skipUntilEnd = function(e, t) {
for (;;) {
var r = h(e, t);
if (e.isError(r)) return r;
var i, n = d(e, r.primitive, t);
if (e.isError(n)) return n;
i = r.primitive || null !== n ? e.skip(n) : this._skipUntilEnd(e, t);
if (e.isError(i)) return i;
if ("end" === r.tagStr) break;
}
};
c.prototype._decodeList = function(e, t, r, i) {
for (var n = []; !e.isEmpty(); ) {
var a = this._peekTag(e, "end");
if (e.isError(a)) return a;
var s = r.decode(e, "der", i);
if (e.isError(s) && a) break;
n.push(s);
}
return n;
};
c.prototype._decodeStr = function(e, t) {
if ("bitstr" === t) {
var r = e.readUInt8();
return e.isError(r) ? r : {
unused: r,
data: e.raw()
};
}
if ("bmpstr" === t) {
var i = e.raw();
if (i.length % 2 == 1) return e.error("Decoding of string type: bmpstr length mismatch");
for (var n = "", a = 0; a < i.length / 2; a++) n += String.fromCharCode(i.readUInt16BE(2 * a));
return n;
}
if ("numstr" === t) {
var s = e.raw().toString("ascii");
return this._isNumstr(s) ? s : e.error("Decoding of string type: numstr unsupported characters");
}
if ("octstr" === t) return e.raw();
if ("objDesc" === t) return e.raw();
if ("printstr" === t) {
var f = e.raw().toString("ascii");
return this._isPrintstr(f) ? f : e.error("Decoding of string type: printstr unsupported characters");
}
return /str$/.test(t) ? e.raw().toString() : e.error("Decoding of string type: " + t + " unsupported");
};
c.prototype._decodeObjid = function(e, t, r) {
for (var i, n = [], a = 0; !e.isEmpty(); ) {
var s = e.readUInt8();
a <<= 7;
a |= 127 & s;
if (0 == (128 & s)) {
n.push(a);
a = 0;
}
}
128 & s && n.push(a);
var f = n[0] / 40 | 0, o = n[0] % 40;
i = r ? n : [ f, o ].concat(n.slice(1));
if (t) {
var c = t[i.join(" ")];
void 0 === c && (c = t[i.join(".")]);
void 0 !== c && (i = c);
}
return i;
};
c.prototype._decodeTime = function(e, t) {
var r = e.raw().toString();
if ("gentime" === t) var i = 0 | r.slice(0, 4), n = 0 | r.slice(4, 6), a = 0 | r.slice(6, 8), s = 0 | r.slice(8, 10), f = 0 | r.slice(10, 12), o = 0 | r.slice(12, 14); else {
if ("utctime" !== t) return e.error("Decoding " + t + " time is not supported yet");
i = 0 | r.slice(0, 2), n = 0 | r.slice(2, 4), a = 0 | r.slice(4, 6), s = 0 | r.slice(6, 8), 
f = 0 | r.slice(8, 10), o = 0 | r.slice(10, 12);
i = i < 70 ? 2e3 + i : 1900 + i;
}
return Date.UTC(i, n - 1, a, s, f, o, 0);
};
c.prototype._decodeNull = function(e) {
return null;
};
c.prototype._decodeBool = function(e) {
var t = e.readUInt8();
return e.isError(t) ? t : 0 !== t;
};
c.prototype._decodeInt = function(e, t) {
var r = e.raw(), i = new s(r);
t && (i = t[i.toString(10)] || i);
return i;
};
c.prototype._use = function(e, t) {
"function" == typeof e && (e = e(t));
return e._getDecoder("der").tree;
};
function h(e, t) {
var r = e.readUInt8(t);
if (e.isError(r)) return r;
var i = f.tagClass[r >> 6], n = 0 == (32 & r);
if (31 == (31 & r)) {
var a = r;
r = 0;
for (;128 == (128 & a); ) {
a = e.readUInt8(t);
if (e.isError(a)) return a;
r <<= 7;
r |= 127 & a;
}
} else r &= 31;
return {
cls: i,
primitive: n,
tag: r,
tagStr: f.tag[r]
};
}
function d(e, t, r) {
var i = e.readUInt8(r);
if (e.isError(i)) return i;
if (!t && 128 === i) return null;
if (0 == (128 & i)) return i;
var n = 127 & i;
if (n > 4) return e.error("length octect is too long");
i = 0;
for (var a = 0; a < n; a++) {
i <<= 8;
var s = e.readUInt8(r);
if (e.isError(s)) return s;
i |= s;
}
return i;
}
}, {
"../../asn1": 1,
inherits: 101
} ],
10: [ function(e, t, r) {
var i = r;
i.der = e("./der");
i.pem = e("./pem");
}, {
"./der": 9,
"./pem": 11
} ],
11: [ function(e, t, r) {
var i = e("inherits"), n = e("buffer").Buffer, a = e("./der");
function s(e) {
a.call(this, e);
this.enc = "pem";
}
i(s, a);
t.exports = s;
s.prototype.decode = function(e, t) {
for (var r = e.toString().split(/[\r\n]+/g), i = t.label.toUpperCase(), s = /^-----(BEGIN|END) ([^-]+)-----$/, f = -1, o = -1, c = 0; c < r.length; c++) {
var h = r[c].match(s);
if (null !== h && h[2] === i) {
if (-1 !== f) {
if ("END" !== h[1]) break;
o = c;
break;
}
if ("BEGIN" !== h[1]) break;
f = c;
}
}
if (-1 === f || -1 === o) throw new Error("PEM section not found for: " + i);
var d = r.slice(f + 1, o).join("");
d.replace(/[^a-z0-9\+\/=]+/gi, "");
var u = new n(d, "base64");
return a.prototype.decode.call(this, u, t);
};
}, {
"./der": 9,
buffer: 47,
inherits: 101
} ],
12: [ function(e, t, r) {
var i = e("inherits"), n = e("buffer").Buffer, a = e("../../asn1"), s = a.base, f = a.constants.der;
function o(e) {
this.enc = "der";
this.name = e.name;
this.entity = e;
this.tree = new c();
this.tree._init(e.body);
}
t.exports = o;
o.prototype.encode = function(e, t) {
return this.tree._encode(e, t).join();
};
function c(e) {
s.Node.call(this, "der", e);
}
i(c, s.Node);
c.prototype._encodeComposite = function(e, t, r, i) {
var a = function(e, t, r, i) {
var n;
"seqof" === e ? e = "seq" : "setof" === e && (e = "set");
if (f.tagByName.hasOwnProperty(e)) n = f.tagByName[e]; else {
if ("number" != typeof e || (0 | e) !== e) return i.error("Unknown tag: " + e);
n = e;
}
if (n >= 31) return i.error("Multi-octet tag encoding unsupported");
t || (n |= 32);
return n |= f.tagClassByName[r || "universal"] << 6;
}(e, t, r, this.reporter);
if (i.length < 128) {
var s;
(s = new n(2))[0] = a;
s[1] = i.length;
return this._createEncoderBuffer([ s, i ]);
}
for (var o = 1, c = i.length; c >= 256; c >>= 8) o++;
(s = new n(2 + o))[0] = a;
s[1] = 128 | o;
c = 1 + o;
for (var h = i.length; h > 0; c--, h >>= 8) s[c] = 255 & h;
return this._createEncoderBuffer([ s, i ]);
};
c.prototype._encodeStr = function(e, t) {
if ("bitstr" === t) return this._createEncoderBuffer([ 0 | e.unused, e.data ]);
if ("bmpstr" === t) {
for (var r = new n(2 * e.length), i = 0; i < e.length; i++) r.writeUInt16BE(e.charCodeAt(i), 2 * i);
return this._createEncoderBuffer(r);
}
return "numstr" === t ? this._isNumstr(e) ? this._createEncoderBuffer(e) : this.reporter.error("Encoding of string type: numstr supports only digits and space") : "printstr" === t ? this._isPrintstr(e) ? this._createEncoderBuffer(e) : this.reporter.error("Encoding of string type: printstr supports only latin upper and lower case letters, digits, space, apostrophe, left and rigth parenthesis, plus sign, comma, hyphen, dot, slash, colon, equal sign, question mark") : /str$/.test(t) ? this._createEncoderBuffer(e) : "objDesc" === t ? this._createEncoderBuffer(e) : this.reporter.error("Encoding of string type: " + t + " unsupported");
};
c.prototype._encodeObjid = function(e, t, r) {
if ("string" == typeof e) {
if (!t) return this.reporter.error("string objid given, but no values map found");
if (!t.hasOwnProperty(e)) return this.reporter.error("objid not found in values map");
e = t[e].split(/[\s\.]+/g);
for (var i = 0; i < e.length; i++) e[i] |= 0;
} else if (Array.isArray(e)) {
e = e.slice();
for (i = 0; i < e.length; i++) e[i] |= 0;
}
if (!Array.isArray(e)) return this.reporter.error("objid() should be either array or string, got: " + JSON.stringify(e));
if (!r) {
if (e[1] >= 40) return this.reporter.error("Second objid identifier OOB");
e.splice(0, 2, 40 * e[0] + e[1]);
}
var a = 0;
for (i = 0; i < e.length; i++) {
var s = e[i];
for (a++; s >= 128; s >>= 7) a++;
}
var f = new n(a), o = f.length - 1;
for (i = e.length - 1; i >= 0; i--) {
s = e[i];
f[o--] = 127 & s;
for (;(s >>= 7) > 0; ) f[o--] = 128 | 127 & s;
}
return this._createEncoderBuffer(f);
};
function h(e) {
return e < 10 ? "0" + e : e;
}
c.prototype._encodeTime = function(e, t) {
var r, i = new Date(e);
"gentime" === t ? r = [ h(i.getFullYear()), h(i.getUTCMonth() + 1), h(i.getUTCDate()), h(i.getUTCHours()), h(i.getUTCMinutes()), h(i.getUTCSeconds()), "Z" ].join("") : "utctime" === t ? r = [ h(i.getFullYear() % 100), h(i.getUTCMonth() + 1), h(i.getUTCDate()), h(i.getUTCHours()), h(i.getUTCMinutes()), h(i.getUTCSeconds()), "Z" ].join("") : this.reporter.error("Encoding " + t + " time is not supported yet");
return this._encodeStr(r, "octstr");
};
c.prototype._encodeNull = function() {
return this._createEncoderBuffer("");
};
c.prototype._encodeInt = function(e, t) {
if ("string" == typeof e) {
if (!t) return this.reporter.error("String int or enum given, but no values map");
if (!t.hasOwnProperty(e)) return this.reporter.error("Values map doesn't contain: " + JSON.stringify(e));
e = t[e];
}
if ("number" != typeof e && !n.isBuffer(e)) {
var r = e.toArray();
!e.sign && 128 & r[0] && r.unshift(0);
e = new n(r);
}
if (n.isBuffer(e)) {
var i = e.length;
0 === e.length && i++;
var a = new n(i);
e.copy(a);
0 === e.length && (a[0] = 0);
return this._createEncoderBuffer(a);
}
if (e < 128) return this._createEncoderBuffer(e);
if (e < 256) return this._createEncoderBuffer([ 0, e ]);
i = 1;
for (var s = e; s >= 256; s >>= 8) i++;
for (s = (a = new Array(i)).length - 1; s >= 0; s--) {
a[s] = 255 & e;
e >>= 8;
}
128 & a[0] && a.unshift(0);
return this._createEncoderBuffer(new n(a));
};
c.prototype._encodeBool = function(e) {
return this._createEncoderBuffer(e ? 255 : 0);
};
c.prototype._use = function(e, t) {
"function" == typeof e && (e = e(t));
return e._getEncoder("der").tree;
};
c.prototype._skipDefault = function(e, t, r) {
var i, n = this._baseState;
if (null === n.default) return !1;
var a = e.join();
void 0 === n.defaultBuffer && (n.defaultBuffer = this._encodeValue(n.default, t, r).join());
if (a.length !== n.defaultBuffer.length) return !1;
for (i = 0; i < a.length; i++) if (a[i] !== n.defaultBuffer[i]) return !1;
return !0;
};
}, {
"../../asn1": 1,
buffer: 47,
inherits: 101
} ],
13: [ function(e, t, r) {
var i = r;
i.der = e("./der");
i.pem = e("./pem");
}, {
"./der": 12,
"./pem": 14
} ],
14: [ function(e, t, r) {
var i = e("inherits"), n = e("./der");
function a(e) {
n.call(this, e);
this.enc = "pem";
}
i(a, n);
t.exports = a;
a.prototype.encode = function(e, t) {
for (var r = n.prototype.encode.call(this, e).toString("base64"), i = [ "-----BEGIN " + t.label + "-----" ], a = 0; a < r.length; a += 64) i.push(r.slice(a, a + 64));
i.push("-----END " + t.label + "-----");
return i.join("\n");
};
}, {
"./der": 12,
inherits: 101
} ],
15: [ function(e, t, r) {
"use strict";
r.byteLength = function(e) {
var t = c(e), r = t[0], i = t[1];
return 3 * (r + i) / 4 - i;
};
r.toByteArray = function(e) {
for (var t, r = c(e), i = r[0], s = r[1], f = new a(function(e, t, r) {
return 3 * (t + r) / 4 - r;
}(0, i, s)), o = 0, h = s > 0 ? i - 4 : i, d = 0; d < h; d += 4) {
t = n[e.charCodeAt(d)] << 18 | n[e.charCodeAt(d + 1)] << 12 | n[e.charCodeAt(d + 2)] << 6 | n[e.charCodeAt(d + 3)];
f[o++] = t >> 16 & 255;
f[o++] = t >> 8 & 255;
f[o++] = 255 & t;
}
if (2 === s) {
t = n[e.charCodeAt(d)] << 2 | n[e.charCodeAt(d + 1)] >> 4;
f[o++] = 255 & t;
}
if (1 === s) {
t = n[e.charCodeAt(d)] << 10 | n[e.charCodeAt(d + 1)] << 4 | n[e.charCodeAt(d + 2)] >> 2;
f[o++] = t >> 8 & 255;
f[o++] = 255 & t;
}
return f;
};
r.fromByteArray = function(e) {
for (var t, r = e.length, n = r % 3, a = [], s = 0, f = r - n; s < f; s += 16383) a.push(d(e, s, s + 16383 > f ? f : s + 16383));
if (1 === n) {
t = e[r - 1];
a.push(i[t >> 2] + i[t << 4 & 63] + "==");
} else if (2 === n) {
t = (e[r - 2] << 8) + e[r - 1];
a.push(i[t >> 10] + i[t >> 4 & 63] + i[t << 2 & 63] + "=");
}
return a.join("");
};
for (var i = [], n = [], a = "undefined" != typeof Uint8Array ? Uint8Array : Array, s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", f = 0, o = s.length; f < o; ++f) {
i[f] = s[f];
n[s.charCodeAt(f)] = f;
}
n["-".charCodeAt(0)] = 62;
n["_".charCodeAt(0)] = 63;
function c(e) {
var t = e.length;
if (t % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
var r = e.indexOf("=");
-1 === r && (r = t);
return [ r, r === t ? 0 : 4 - r % 4 ];
}
function h(e) {
return i[e >> 18 & 63] + i[e >> 12 & 63] + i[e >> 6 & 63] + i[63 & e];
}
function d(e, t, r) {
for (var i, n = [], a = t; a < r; a += 3) {
i = (e[a] << 16 & 16711680) + (e[a + 1] << 8 & 65280) + (255 & e[a + 2]);
n.push(h(i));
}
return n.join("");
}
}, {} ],
16: [ function(e, t, r) {
(function(t, r) {
"use strict";
function i(e, t) {
if (!e) throw new Error(t || "Assertion failed");
}
function n(e, t) {
e.super_ = t;
var r = function() {};
r.prototype = t.prototype;
e.prototype = new r();
e.prototype.constructor = e;
}
function a(e, t, r) {
if (a.isBN(e)) return e;
this.negative = 0;
this.words = null;
this.length = 0;
this.red = null;
if (null !== e) {
if ("le" === t || "be" === t) {
r = t;
t = 10;
}
this._init(e || 0, t || 10, r || "be");
}
}
"object" == typeof t ? t.exports = a : r.BN = a;
a.BN = a;
a.wordSize = 26;
var s;
try {
s = e("buffer").Buffer;
} catch (e) {}
a.isBN = function(e) {
return e instanceof a || null !== e && "object" == typeof e && e.constructor.wordSize === a.wordSize && Array.isArray(e.words);
};
a.max = function(e, t) {
return e.cmp(t) > 0 ? e : t;
};
a.min = function(e, t) {
return e.cmp(t) < 0 ? e : t;
};
a.prototype._init = function(e, t, r) {
if ("number" == typeof e) return this._initNumber(e, t, r);
if ("object" == typeof e) return this._initArray(e, t, r);
"hex" === t && (t = 16);
i(t === (0 | t) && t >= 2 && t <= 36);
var n = 0;
"-" === (e = e.toString().replace(/\s+/g, ""))[0] && n++;
16 === t ? this._parseHex(e, n) : this._parseBase(e, t, n);
"-" === e[0] && (this.negative = 1);
this.strip();
"le" === r && this._initArray(this.toArray(), t, r);
};
a.prototype._initNumber = function(e, t, r) {
if (e < 0) {
this.negative = 1;
e = -e;
}
if (e < 67108864) {
this.words = [ 67108863 & e ];
this.length = 1;
} else if (e < 4503599627370496) {
this.words = [ 67108863 & e, e / 67108864 & 67108863 ];
this.length = 2;
} else {
i(e < 9007199254740992);
this.words = [ 67108863 & e, e / 67108864 & 67108863, 1 ];
this.length = 3;
}
"le" === r && this._initArray(this.toArray(), t, r);
};
a.prototype._initArray = function(e, t, r) {
i("number" == typeof e.length);
if (e.length <= 0) {
this.words = [ 0 ];
this.length = 1;
return this;
}
this.length = Math.ceil(e.length / 3);
this.words = new Array(this.length);
for (var n = 0; n < this.length; n++) this.words[n] = 0;
var a, s, f = 0;
if ("be" === r) for (n = e.length - 1, a = 0; n >= 0; n -= 3) {
s = e[n] | e[n - 1] << 8 | e[n - 2] << 16;
this.words[a] |= s << f & 67108863;
this.words[a + 1] = s >>> 26 - f & 67108863;
if ((f += 24) >= 26) {
f -= 26;
a++;
}
} else if ("le" === r) for (n = 0, a = 0; n < e.length; n += 3) {
s = e[n] | e[n + 1] << 8 | e[n + 2] << 16;
this.words[a] |= s << f & 67108863;
this.words[a + 1] = s >>> 26 - f & 67108863;
if ((f += 24) >= 26) {
f -= 26;
a++;
}
}
return this.strip();
};
function f(e, t, r) {
for (var i = 0, n = Math.min(e.length, r), a = t; a < n; a++) {
var s = e.charCodeAt(a) - 48;
i <<= 4;
i |= s >= 49 && s <= 54 ? s - 49 + 10 : s >= 17 && s <= 22 ? s - 17 + 10 : 15 & s;
}
return i;
}
a.prototype._parseHex = function(e, t) {
this.length = Math.ceil((e.length - t) / 6);
this.words = new Array(this.length);
for (var r = 0; r < this.length; r++) this.words[r] = 0;
var i, n, a = 0;
for (r = e.length - 6, i = 0; r >= t; r -= 6) {
n = f(e, r, r + 6);
this.words[i] |= n << a & 67108863;
this.words[i + 1] |= n >>> 26 - a & 4194303;
if ((a += 24) >= 26) {
a -= 26;
i++;
}
}
if (r + 6 !== t) {
n = f(e, t, r + 6);
this.words[i] |= n << a & 67108863;
this.words[i + 1] |= n >>> 26 - a & 4194303;
}
this.strip();
};
function o(e, t, r, i) {
for (var n = 0, a = Math.min(e.length, r), s = t; s < a; s++) {
var f = e.charCodeAt(s) - 48;
n *= i;
n += f >= 49 ? f - 49 + 10 : f >= 17 ? f - 17 + 10 : f;
}
return n;
}
a.prototype._parseBase = function(e, t, r) {
this.words = [ 0 ];
this.length = 1;
for (var i = 0, n = 1; n <= 67108863; n *= t) i++;
i--;
n = n / t | 0;
for (var a = e.length - r, s = a % i, f = Math.min(a, a - s) + r, c = 0, h = r; h < f; h += i) {
c = o(e, h, h + i, t);
this.imuln(n);
this.words[0] + c < 67108864 ? this.words[0] += c : this._iaddn(c);
}
if (0 !== s) {
var d = 1;
c = o(e, h, e.length, t);
for (h = 0; h < s; h++) d *= t;
this.imuln(d);
this.words[0] + c < 67108864 ? this.words[0] += c : this._iaddn(c);
}
};
a.prototype.copy = function(e) {
e.words = new Array(this.length);
for (var t = 0; t < this.length; t++) e.words[t] = this.words[t];
e.length = this.length;
e.negative = this.negative;
e.red = this.red;
};
a.prototype.clone = function() {
var e = new a(null);
this.copy(e);
return e;
};
a.prototype._expand = function(e) {
for (;this.length < e; ) this.words[this.length++] = 0;
return this;
};
a.prototype.strip = function() {
for (;this.length > 1 && 0 === this.words[this.length - 1]; ) this.length--;
return this._normSign();
};
a.prototype._normSign = function() {
1 === this.length && 0 === this.words[0] && (this.negative = 0);
return this;
};
a.prototype.inspect = function() {
return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">";
};
var c = [ "", "0", "00", "000", "0000", "00000", "000000", "0000000", "00000000", "000000000", "0000000000", "00000000000", "000000000000", "0000000000000", "00000000000000", "000000000000000", "0000000000000000", "00000000000000000", "000000000000000000", "0000000000000000000", "00000000000000000000", "000000000000000000000", "0000000000000000000000", "00000000000000000000000", "000000000000000000000000", "0000000000000000000000000" ], h = [ 0, 0, 25, 16, 12, 11, 10, 9, 8, 8, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5 ], d = [ 0, 0, 33554432, 43046721, 16777216, 48828125, 60466176, 40353607, 16777216, 43046721, 1e7, 19487171, 35831808, 62748517, 7529536, 11390625, 16777216, 24137569, 34012224, 47045881, 64e6, 4084101, 5153632, 6436343, 7962624, 9765625, 11881376, 14348907, 17210368, 20511149, 243e5, 28629151, 33554432, 39135393, 45435424, 52521875, 60466176 ];
a.prototype.toString = function(e, t) {
e = e || 10;
t = 0 | t || 1;
var r;
if (16 === e || "hex" === e) {
r = "";
for (var n = 0, a = 0, s = 0; s < this.length; s++) {
var f = this.words[s], o = (16777215 & (f << n | a)).toString(16);
r = 0 !== (a = f >>> 24 - n & 16777215) || s !== this.length - 1 ? c[6 - o.length] + o + r : o + r;
if ((n += 2) >= 26) {
n -= 26;
s--;
}
}
0 !== a && (r = a.toString(16) + r);
for (;r.length % t != 0; ) r = "0" + r;
0 !== this.negative && (r = "-" + r);
return r;
}
if (e === (0 | e) && e >= 2 && e <= 36) {
var u = h[e], l = d[e];
r = "";
var p = this.clone();
p.negative = 0;
for (;!p.isZero(); ) {
var b = p.modn(l).toString(e);
r = (p = p.idivn(l)).isZero() ? b + r : c[u - b.length] + b + r;
}
this.isZero() && (r = "0" + r);
for (;r.length % t != 0; ) r = "0" + r;
0 !== this.negative && (r = "-" + r);
return r;
}
i(!1, "Base should be between 2 and 36");
};
a.prototype.toNumber = function() {
var e = this.words[0];
2 === this.length ? e += 67108864 * this.words[1] : 3 === this.length && 1 === this.words[2] ? e += 4503599627370496 + 67108864 * this.words[1] : this.length > 2 && i(!1, "Number can only safely store up to 53 bits");
return 0 !== this.negative ? -e : e;
};
a.prototype.toJSON = function() {
return this.toString(16);
};
a.prototype.toBuffer = function(e, t) {
i("undefined" != typeof s);
return this.toArrayLike(s, e, t);
};
a.prototype.toArray = function(e, t) {
return this.toArrayLike(Array, e, t);
};
a.prototype.toArrayLike = function(e, t, r) {
var n = this.byteLength(), a = r || Math.max(1, n);
i(n <= a, "byte array longer than desired length");
i(a > 0, "Requested array length <= 0");
this.strip();
var s, f, o = "le" === t, c = new e(a), h = this.clone();
if (o) {
for (f = 0; !h.isZero(); f++) {
s = h.andln(255);
h.iushrn(8);
c[f] = s;
}
for (;f < a; f++) c[f] = 0;
} else {
for (f = 0; f < a - n; f++) c[f] = 0;
for (f = 0; !h.isZero(); f++) {
s = h.andln(255);
h.iushrn(8);
c[a - f - 1] = s;
}
}
return c;
};
Math.clz32 ? a.prototype._countBits = function(e) {
return 32 - Math.clz32(e);
} : a.prototype._countBits = function(e) {
var t = e, r = 0;
if (t >= 4096) {
r += 13;
t >>>= 13;
}
if (t >= 64) {
r += 7;
t >>>= 7;
}
if (t >= 8) {
r += 4;
t >>>= 4;
}
if (t >= 2) {
r += 2;
t >>>= 2;
}
return r + t;
};
a.prototype._zeroBits = function(e) {
if (0 === e) return 26;
var t = e, r = 0;
if (0 == (8191 & t)) {
r += 13;
t >>>= 13;
}
if (0 == (127 & t)) {
r += 7;
t >>>= 7;
}
if (0 == (15 & t)) {
r += 4;
t >>>= 4;
}
if (0 == (3 & t)) {
r += 2;
t >>>= 2;
}
0 == (1 & t) && r++;
return r;
};
a.prototype.bitLength = function() {
var e = this.words[this.length - 1], t = this._countBits(e);
return 26 * (this.length - 1) + t;
};
a.prototype.zeroBits = function() {
if (this.isZero()) return 0;
for (var e = 0, t = 0; t < this.length; t++) {
var r = this._zeroBits(this.words[t]);
e += r;
if (26 !== r) break;
}
return e;
};
a.prototype.byteLength = function() {
return Math.ceil(this.bitLength() / 8);
};
a.prototype.toTwos = function(e) {
return 0 !== this.negative ? this.abs().inotn(e).iaddn(1) : this.clone();
};
a.prototype.fromTwos = function(e) {
return this.testn(e - 1) ? this.notn(e).iaddn(1).ineg() : this.clone();
};
a.prototype.isNeg = function() {
return 0 !== this.negative;
};
a.prototype.neg = function() {
return this.clone().ineg();
};
a.prototype.ineg = function() {
this.isZero() || (this.negative ^= 1);
return this;
};
a.prototype.iuor = function(e) {
for (;this.length < e.length; ) this.words[this.length++] = 0;
for (var t = 0; t < e.length; t++) this.words[t] = this.words[t] | e.words[t];
return this.strip();
};
a.prototype.ior = function(e) {
i(0 == (this.negative | e.negative));
return this.iuor(e);
};
a.prototype.or = function(e) {
return this.length > e.length ? this.clone().ior(e) : e.clone().ior(this);
};
a.prototype.uor = function(e) {
return this.length > e.length ? this.clone().iuor(e) : e.clone().iuor(this);
};
a.prototype.iuand = function(e) {
var t;
t = this.length > e.length ? e : this;
for (var r = 0; r < t.length; r++) this.words[r] = this.words[r] & e.words[r];
this.length = t.length;
return this.strip();
};
a.prototype.iand = function(e) {
i(0 == (this.negative | e.negative));
return this.iuand(e);
};
a.prototype.and = function(e) {
return this.length > e.length ? this.clone().iand(e) : e.clone().iand(this);
};
a.prototype.uand = function(e) {
return this.length > e.length ? this.clone().iuand(e) : e.clone().iuand(this);
};
a.prototype.iuxor = function(e) {
var t, r;
if (this.length > e.length) {
t = this;
r = e;
} else {
t = e;
r = this;
}
for (var i = 0; i < r.length; i++) this.words[i] = t.words[i] ^ r.words[i];
if (this !== t) for (;i < t.length; i++) this.words[i] = t.words[i];
this.length = t.length;
return this.strip();
};
a.prototype.ixor = function(e) {
i(0 == (this.negative | e.negative));
return this.iuxor(e);
};
a.prototype.xor = function(e) {
return this.length > e.length ? this.clone().ixor(e) : e.clone().ixor(this);
};
a.prototype.uxor = function(e) {
return this.length > e.length ? this.clone().iuxor(e) : e.clone().iuxor(this);
};
a.prototype.inotn = function(e) {
i("number" == typeof e && e >= 0);
var t = 0 | Math.ceil(e / 26), r = e % 26;
this._expand(t);
r > 0 && t--;
for (var n = 0; n < t; n++) this.words[n] = 67108863 & ~this.words[n];
r > 0 && (this.words[n] = ~this.words[n] & 67108863 >> 26 - r);
return this.strip();
};
a.prototype.notn = function(e) {
return this.clone().inotn(e);
};
a.prototype.setn = function(e, t) {
i("number" == typeof e && e >= 0);
var r = e / 26 | 0, n = e % 26;
this._expand(r + 1);
this.words[r] = t ? this.words[r] | 1 << n : this.words[r] & ~(1 << n);
return this.strip();
};
a.prototype.iadd = function(e) {
var t, r, i;
if (0 !== this.negative && 0 === e.negative) {
this.negative = 0;
t = this.isub(e);
this.negative ^= 1;
return this._normSign();
}
if (0 === this.negative && 0 !== e.negative) {
e.negative = 0;
t = this.isub(e);
e.negative = 1;
return t._normSign();
}
if (this.length > e.length) {
r = this;
i = e;
} else {
r = e;
i = this;
}
for (var n = 0, a = 0; a < i.length; a++) {
t = (0 | r.words[a]) + (0 | i.words[a]) + n;
this.words[a] = 67108863 & t;
n = t >>> 26;
}
for (;0 !== n && a < r.length; a++) {
t = (0 | r.words[a]) + n;
this.words[a] = 67108863 & t;
n = t >>> 26;
}
this.length = r.length;
if (0 !== n) {
this.words[this.length] = n;
this.length++;
} else if (r !== this) for (;a < r.length; a++) this.words[a] = r.words[a];
return this;
};
a.prototype.add = function(e) {
var t;
if (0 !== e.negative && 0 === this.negative) {
e.negative = 0;
t = this.sub(e);
e.negative ^= 1;
return t;
}
if (0 === e.negative && 0 !== this.negative) {
this.negative = 0;
t = e.sub(this);
this.negative = 1;
return t;
}
return this.length > e.length ? this.clone().iadd(e) : e.clone().iadd(this);
};
a.prototype.isub = function(e) {
if (0 !== e.negative) {
e.negative = 0;
var t = this.iadd(e);
e.negative = 1;
return t._normSign();
}
if (0 !== this.negative) {
this.negative = 0;
this.iadd(e);
this.negative = 1;
return this._normSign();
}
var r, i, n = this.cmp(e);
if (0 === n) {
this.negative = 0;
this.length = 1;
this.words[0] = 0;
return this;
}
if (n > 0) {
r = this;
i = e;
} else {
r = e;
i = this;
}
for (var a = 0, s = 0; s < i.length; s++) {
a = (t = (0 | r.words[s]) - (0 | i.words[s]) + a) >> 26;
this.words[s] = 67108863 & t;
}
for (;0 !== a && s < r.length; s++) {
a = (t = (0 | r.words[s]) + a) >> 26;
this.words[s] = 67108863 & t;
}
if (0 === a && s < r.length && r !== this) for (;s < r.length; s++) this.words[s] = r.words[s];
this.length = Math.max(this.length, s);
r !== this && (this.negative = 1);
return this.strip();
};
a.prototype.sub = function(e) {
return this.clone().isub(e);
};
function u(e, t, r) {
r.negative = t.negative ^ e.negative;
var i = e.length + t.length | 0;
r.length = i;
i = i - 1 | 0;
var n = 0 | e.words[0], a = 0 | t.words[0], s = n * a, f = 67108863 & s, o = s / 67108864 | 0;
r.words[0] = f;
for (var c = 1; c < i; c++) {
for (var h = o >>> 26, d = 67108863 & o, u = Math.min(c, t.length - 1), l = Math.max(0, c - e.length + 1); l <= u; l++) {
var p = c - l | 0;
h += (s = (n = 0 | e.words[p]) * (a = 0 | t.words[l]) + d) / 67108864 | 0;
d = 67108863 & s;
}
r.words[c] = 0 | d;
o = 0 | h;
}
0 !== o ? r.words[c] = 0 | o : r.length--;
return r.strip();
}
var l = function(e, t, r) {
var i, n, a, s = e.words, f = t.words, o = r.words, c = 0, h = 0 | s[0], d = 8191 & h, u = h >>> 13, l = 0 | s[1], p = 8191 & l, b = l >>> 13, g = 0 | s[2], m = 8191 & g, y = g >>> 13, v = 0 | s[3], _ = 8191 & v, w = v >>> 13, S = 0 | s[4], E = 8191 & S, M = S >>> 13, k = 0 | s[5], A = 8191 & k, x = k >>> 13, I = 0 | s[6], R = 8191 & I, B = I >>> 13, C = 0 | s[7], j = 8191 & C, P = C >>> 13, T = 0 | s[8], U = 8191 & T, D = T >>> 13, N = 0 | s[9], O = 8191 & N, L = N >>> 13, z = 0 | f[0], q = 8191 & z, F = z >>> 13, H = 0 | f[1], K = 8191 & H, Y = H >>> 13, W = 0 | f[2], V = 8191 & W, X = W >>> 13, G = 0 | f[3], J = 8191 & G, Z = G >>> 13, $ = 0 | f[4], Q = 8191 & $, ee = $ >>> 13, te = 0 | f[5], re = 8191 & te, ie = te >>> 13, ne = 0 | f[6], ae = 8191 & ne, se = ne >>> 13, fe = 0 | f[7], oe = 8191 & fe, ce = fe >>> 13, he = 0 | f[8], de = 8191 & he, ue = he >>> 13, le = 0 | f[9], pe = 8191 & le, be = le >>> 13;
r.negative = e.negative ^ t.negative;
r.length = 19;
var ge = (c + (i = Math.imul(d, q)) | 0) + ((8191 & (n = (n = Math.imul(d, F)) + Math.imul(u, q) | 0)) << 13) | 0;
c = ((a = Math.imul(u, F)) + (n >>> 13) | 0) + (ge >>> 26) | 0;
ge &= 67108863;
i = Math.imul(p, q);
n = (n = Math.imul(p, F)) + Math.imul(b, q) | 0;
a = Math.imul(b, F);
var me = (c + (i = i + Math.imul(d, K) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(d, Y) | 0) + Math.imul(u, K) | 0)) << 13) | 0;
c = ((a = a + Math.imul(u, Y) | 0) + (n >>> 13) | 0) + (me >>> 26) | 0;
me &= 67108863;
i = Math.imul(m, q);
n = (n = Math.imul(m, F)) + Math.imul(y, q) | 0;
a = Math.imul(y, F);
i = i + Math.imul(p, K) | 0;
n = (n = n + Math.imul(p, Y) | 0) + Math.imul(b, K) | 0;
a = a + Math.imul(b, Y) | 0;
var ye = (c + (i = i + Math.imul(d, V) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(d, X) | 0) + Math.imul(u, V) | 0)) << 13) | 0;
c = ((a = a + Math.imul(u, X) | 0) + (n >>> 13) | 0) + (ye >>> 26) | 0;
ye &= 67108863;
i = Math.imul(_, q);
n = (n = Math.imul(_, F)) + Math.imul(w, q) | 0;
a = Math.imul(w, F);
i = i + Math.imul(m, K) | 0;
n = (n = n + Math.imul(m, Y) | 0) + Math.imul(y, K) | 0;
a = a + Math.imul(y, Y) | 0;
i = i + Math.imul(p, V) | 0;
n = (n = n + Math.imul(p, X) | 0) + Math.imul(b, V) | 0;
a = a + Math.imul(b, X) | 0;
var ve = (c + (i = i + Math.imul(d, J) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(d, Z) | 0) + Math.imul(u, J) | 0)) << 13) | 0;
c = ((a = a + Math.imul(u, Z) | 0) + (n >>> 13) | 0) + (ve >>> 26) | 0;
ve &= 67108863;
i = Math.imul(E, q);
n = (n = Math.imul(E, F)) + Math.imul(M, q) | 0;
a = Math.imul(M, F);
i = i + Math.imul(_, K) | 0;
n = (n = n + Math.imul(_, Y) | 0) + Math.imul(w, K) | 0;
a = a + Math.imul(w, Y) | 0;
i = i + Math.imul(m, V) | 0;
n = (n = n + Math.imul(m, X) | 0) + Math.imul(y, V) | 0;
a = a + Math.imul(y, X) | 0;
i = i + Math.imul(p, J) | 0;
n = (n = n + Math.imul(p, Z) | 0) + Math.imul(b, J) | 0;
a = a + Math.imul(b, Z) | 0;
var _e = (c + (i = i + Math.imul(d, Q) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(d, ee) | 0) + Math.imul(u, Q) | 0)) << 13) | 0;
c = ((a = a + Math.imul(u, ee) | 0) + (n >>> 13) | 0) + (_e >>> 26) | 0;
_e &= 67108863;
i = Math.imul(A, q);
n = (n = Math.imul(A, F)) + Math.imul(x, q) | 0;
a = Math.imul(x, F);
i = i + Math.imul(E, K) | 0;
n = (n = n + Math.imul(E, Y) | 0) + Math.imul(M, K) | 0;
a = a + Math.imul(M, Y) | 0;
i = i + Math.imul(_, V) | 0;
n = (n = n + Math.imul(_, X) | 0) + Math.imul(w, V) | 0;
a = a + Math.imul(w, X) | 0;
i = i + Math.imul(m, J) | 0;
n = (n = n + Math.imul(m, Z) | 0) + Math.imul(y, J) | 0;
a = a + Math.imul(y, Z) | 0;
i = i + Math.imul(p, Q) | 0;
n = (n = n + Math.imul(p, ee) | 0) + Math.imul(b, Q) | 0;
a = a + Math.imul(b, ee) | 0;
var we = (c + (i = i + Math.imul(d, re) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(d, ie) | 0) + Math.imul(u, re) | 0)) << 13) | 0;
c = ((a = a + Math.imul(u, ie) | 0) + (n >>> 13) | 0) + (we >>> 26) | 0;
we &= 67108863;
i = Math.imul(R, q);
n = (n = Math.imul(R, F)) + Math.imul(B, q) | 0;
a = Math.imul(B, F);
i = i + Math.imul(A, K) | 0;
n = (n = n + Math.imul(A, Y) | 0) + Math.imul(x, K) | 0;
a = a + Math.imul(x, Y) | 0;
i = i + Math.imul(E, V) | 0;
n = (n = n + Math.imul(E, X) | 0) + Math.imul(M, V) | 0;
a = a + Math.imul(M, X) | 0;
i = i + Math.imul(_, J) | 0;
n = (n = n + Math.imul(_, Z) | 0) + Math.imul(w, J) | 0;
a = a + Math.imul(w, Z) | 0;
i = i + Math.imul(m, Q) | 0;
n = (n = n + Math.imul(m, ee) | 0) + Math.imul(y, Q) | 0;
a = a + Math.imul(y, ee) | 0;
i = i + Math.imul(p, re) | 0;
n = (n = n + Math.imul(p, ie) | 0) + Math.imul(b, re) | 0;
a = a + Math.imul(b, ie) | 0;
var Se = (c + (i = i + Math.imul(d, ae) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(d, se) | 0) + Math.imul(u, ae) | 0)) << 13) | 0;
c = ((a = a + Math.imul(u, se) | 0) + (n >>> 13) | 0) + (Se >>> 26) | 0;
Se &= 67108863;
i = Math.imul(j, q);
n = (n = Math.imul(j, F)) + Math.imul(P, q) | 0;
a = Math.imul(P, F);
i = i + Math.imul(R, K) | 0;
n = (n = n + Math.imul(R, Y) | 0) + Math.imul(B, K) | 0;
a = a + Math.imul(B, Y) | 0;
i = i + Math.imul(A, V) | 0;
n = (n = n + Math.imul(A, X) | 0) + Math.imul(x, V) | 0;
a = a + Math.imul(x, X) | 0;
i = i + Math.imul(E, J) | 0;
n = (n = n + Math.imul(E, Z) | 0) + Math.imul(M, J) | 0;
a = a + Math.imul(M, Z) | 0;
i = i + Math.imul(_, Q) | 0;
n = (n = n + Math.imul(_, ee) | 0) + Math.imul(w, Q) | 0;
a = a + Math.imul(w, ee) | 0;
i = i + Math.imul(m, re) | 0;
n = (n = n + Math.imul(m, ie) | 0) + Math.imul(y, re) | 0;
a = a + Math.imul(y, ie) | 0;
i = i + Math.imul(p, ae) | 0;
n = (n = n + Math.imul(p, se) | 0) + Math.imul(b, ae) | 0;
a = a + Math.imul(b, se) | 0;
var Ee = (c + (i = i + Math.imul(d, oe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(d, ce) | 0) + Math.imul(u, oe) | 0)) << 13) | 0;
c = ((a = a + Math.imul(u, ce) | 0) + (n >>> 13) | 0) + (Ee >>> 26) | 0;
Ee &= 67108863;
i = Math.imul(U, q);
n = (n = Math.imul(U, F)) + Math.imul(D, q) | 0;
a = Math.imul(D, F);
i = i + Math.imul(j, K) | 0;
n = (n = n + Math.imul(j, Y) | 0) + Math.imul(P, K) | 0;
a = a + Math.imul(P, Y) | 0;
i = i + Math.imul(R, V) | 0;
n = (n = n + Math.imul(R, X) | 0) + Math.imul(B, V) | 0;
a = a + Math.imul(B, X) | 0;
i = i + Math.imul(A, J) | 0;
n = (n = n + Math.imul(A, Z) | 0) + Math.imul(x, J) | 0;
a = a + Math.imul(x, Z) | 0;
i = i + Math.imul(E, Q) | 0;
n = (n = n + Math.imul(E, ee) | 0) + Math.imul(M, Q) | 0;
a = a + Math.imul(M, ee) | 0;
i = i + Math.imul(_, re) | 0;
n = (n = n + Math.imul(_, ie) | 0) + Math.imul(w, re) | 0;
a = a + Math.imul(w, ie) | 0;
i = i + Math.imul(m, ae) | 0;
n = (n = n + Math.imul(m, se) | 0) + Math.imul(y, ae) | 0;
a = a + Math.imul(y, se) | 0;
i = i + Math.imul(p, oe) | 0;
n = (n = n + Math.imul(p, ce) | 0) + Math.imul(b, oe) | 0;
a = a + Math.imul(b, ce) | 0;
var Me = (c + (i = i + Math.imul(d, de) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(d, ue) | 0) + Math.imul(u, de) | 0)) << 13) | 0;
c = ((a = a + Math.imul(u, ue) | 0) + (n >>> 13) | 0) + (Me >>> 26) | 0;
Me &= 67108863;
i = Math.imul(O, q);
n = (n = Math.imul(O, F)) + Math.imul(L, q) | 0;
a = Math.imul(L, F);
i = i + Math.imul(U, K) | 0;
n = (n = n + Math.imul(U, Y) | 0) + Math.imul(D, K) | 0;
a = a + Math.imul(D, Y) | 0;
i = i + Math.imul(j, V) | 0;
n = (n = n + Math.imul(j, X) | 0) + Math.imul(P, V) | 0;
a = a + Math.imul(P, X) | 0;
i = i + Math.imul(R, J) | 0;
n = (n = n + Math.imul(R, Z) | 0) + Math.imul(B, J) | 0;
a = a + Math.imul(B, Z) | 0;
i = i + Math.imul(A, Q) | 0;
n = (n = n + Math.imul(A, ee) | 0) + Math.imul(x, Q) | 0;
a = a + Math.imul(x, ee) | 0;
i = i + Math.imul(E, re) | 0;
n = (n = n + Math.imul(E, ie) | 0) + Math.imul(M, re) | 0;
a = a + Math.imul(M, ie) | 0;
i = i + Math.imul(_, ae) | 0;
n = (n = n + Math.imul(_, se) | 0) + Math.imul(w, ae) | 0;
a = a + Math.imul(w, se) | 0;
i = i + Math.imul(m, oe) | 0;
n = (n = n + Math.imul(m, ce) | 0) + Math.imul(y, oe) | 0;
a = a + Math.imul(y, ce) | 0;
i = i + Math.imul(p, de) | 0;
n = (n = n + Math.imul(p, ue) | 0) + Math.imul(b, de) | 0;
a = a + Math.imul(b, ue) | 0;
var ke = (c + (i = i + Math.imul(d, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(d, be) | 0) + Math.imul(u, pe) | 0)) << 13) | 0;
c = ((a = a + Math.imul(u, be) | 0) + (n >>> 13) | 0) + (ke >>> 26) | 0;
ke &= 67108863;
i = Math.imul(O, K);
n = (n = Math.imul(O, Y)) + Math.imul(L, K) | 0;
a = Math.imul(L, Y);
i = i + Math.imul(U, V) | 0;
n = (n = n + Math.imul(U, X) | 0) + Math.imul(D, V) | 0;
a = a + Math.imul(D, X) | 0;
i = i + Math.imul(j, J) | 0;
n = (n = n + Math.imul(j, Z) | 0) + Math.imul(P, J) | 0;
a = a + Math.imul(P, Z) | 0;
i = i + Math.imul(R, Q) | 0;
n = (n = n + Math.imul(R, ee) | 0) + Math.imul(B, Q) | 0;
a = a + Math.imul(B, ee) | 0;
i = i + Math.imul(A, re) | 0;
n = (n = n + Math.imul(A, ie) | 0) + Math.imul(x, re) | 0;
a = a + Math.imul(x, ie) | 0;
i = i + Math.imul(E, ae) | 0;
n = (n = n + Math.imul(E, se) | 0) + Math.imul(M, ae) | 0;
a = a + Math.imul(M, se) | 0;
i = i + Math.imul(_, oe) | 0;
n = (n = n + Math.imul(_, ce) | 0) + Math.imul(w, oe) | 0;
a = a + Math.imul(w, ce) | 0;
i = i + Math.imul(m, de) | 0;
n = (n = n + Math.imul(m, ue) | 0) + Math.imul(y, de) | 0;
a = a + Math.imul(y, ue) | 0;
var Ae = (c + (i = i + Math.imul(p, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(p, be) | 0) + Math.imul(b, pe) | 0)) << 13) | 0;
c = ((a = a + Math.imul(b, be) | 0) + (n >>> 13) | 0) + (Ae >>> 26) | 0;
Ae &= 67108863;
i = Math.imul(O, V);
n = (n = Math.imul(O, X)) + Math.imul(L, V) | 0;
a = Math.imul(L, X);
i = i + Math.imul(U, J) | 0;
n = (n = n + Math.imul(U, Z) | 0) + Math.imul(D, J) | 0;
a = a + Math.imul(D, Z) | 0;
i = i + Math.imul(j, Q) | 0;
n = (n = n + Math.imul(j, ee) | 0) + Math.imul(P, Q) | 0;
a = a + Math.imul(P, ee) | 0;
i = i + Math.imul(R, re) | 0;
n = (n = n + Math.imul(R, ie) | 0) + Math.imul(B, re) | 0;
a = a + Math.imul(B, ie) | 0;
i = i + Math.imul(A, ae) | 0;
n = (n = n + Math.imul(A, se) | 0) + Math.imul(x, ae) | 0;
a = a + Math.imul(x, se) | 0;
i = i + Math.imul(E, oe) | 0;
n = (n = n + Math.imul(E, ce) | 0) + Math.imul(M, oe) | 0;
a = a + Math.imul(M, ce) | 0;
i = i + Math.imul(_, de) | 0;
n = (n = n + Math.imul(_, ue) | 0) + Math.imul(w, de) | 0;
a = a + Math.imul(w, ue) | 0;
var xe = (c + (i = i + Math.imul(m, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(m, be) | 0) + Math.imul(y, pe) | 0)) << 13) | 0;
c = ((a = a + Math.imul(y, be) | 0) + (n >>> 13) | 0) + (xe >>> 26) | 0;
xe &= 67108863;
i = Math.imul(O, J);
n = (n = Math.imul(O, Z)) + Math.imul(L, J) | 0;
a = Math.imul(L, Z);
i = i + Math.imul(U, Q) | 0;
n = (n = n + Math.imul(U, ee) | 0) + Math.imul(D, Q) | 0;
a = a + Math.imul(D, ee) | 0;
i = i + Math.imul(j, re) | 0;
n = (n = n + Math.imul(j, ie) | 0) + Math.imul(P, re) | 0;
a = a + Math.imul(P, ie) | 0;
i = i + Math.imul(R, ae) | 0;
n = (n = n + Math.imul(R, se) | 0) + Math.imul(B, ae) | 0;
a = a + Math.imul(B, se) | 0;
i = i + Math.imul(A, oe) | 0;
n = (n = n + Math.imul(A, ce) | 0) + Math.imul(x, oe) | 0;
a = a + Math.imul(x, ce) | 0;
i = i + Math.imul(E, de) | 0;
n = (n = n + Math.imul(E, ue) | 0) + Math.imul(M, de) | 0;
a = a + Math.imul(M, ue) | 0;
var Ie = (c + (i = i + Math.imul(_, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(_, be) | 0) + Math.imul(w, pe) | 0)) << 13) | 0;
c = ((a = a + Math.imul(w, be) | 0) + (n >>> 13) | 0) + (Ie >>> 26) | 0;
Ie &= 67108863;
i = Math.imul(O, Q);
n = (n = Math.imul(O, ee)) + Math.imul(L, Q) | 0;
a = Math.imul(L, ee);
i = i + Math.imul(U, re) | 0;
n = (n = n + Math.imul(U, ie) | 0) + Math.imul(D, re) | 0;
a = a + Math.imul(D, ie) | 0;
i = i + Math.imul(j, ae) | 0;
n = (n = n + Math.imul(j, se) | 0) + Math.imul(P, ae) | 0;
a = a + Math.imul(P, se) | 0;
i = i + Math.imul(R, oe) | 0;
n = (n = n + Math.imul(R, ce) | 0) + Math.imul(B, oe) | 0;
a = a + Math.imul(B, ce) | 0;
i = i + Math.imul(A, de) | 0;
n = (n = n + Math.imul(A, ue) | 0) + Math.imul(x, de) | 0;
a = a + Math.imul(x, ue) | 0;
var Re = (c + (i = i + Math.imul(E, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(E, be) | 0) + Math.imul(M, pe) | 0)) << 13) | 0;
c = ((a = a + Math.imul(M, be) | 0) + (n >>> 13) | 0) + (Re >>> 26) | 0;
Re &= 67108863;
i = Math.imul(O, re);
n = (n = Math.imul(O, ie)) + Math.imul(L, re) | 0;
a = Math.imul(L, ie);
i = i + Math.imul(U, ae) | 0;
n = (n = n + Math.imul(U, se) | 0) + Math.imul(D, ae) | 0;
a = a + Math.imul(D, se) | 0;
i = i + Math.imul(j, oe) | 0;
n = (n = n + Math.imul(j, ce) | 0) + Math.imul(P, oe) | 0;
a = a + Math.imul(P, ce) | 0;
i = i + Math.imul(R, de) | 0;
n = (n = n + Math.imul(R, ue) | 0) + Math.imul(B, de) | 0;
a = a + Math.imul(B, ue) | 0;
var Be = (c + (i = i + Math.imul(A, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(A, be) | 0) + Math.imul(x, pe) | 0)) << 13) | 0;
c = ((a = a + Math.imul(x, be) | 0) + (n >>> 13) | 0) + (Be >>> 26) | 0;
Be &= 67108863;
i = Math.imul(O, ae);
n = (n = Math.imul(O, se)) + Math.imul(L, ae) | 0;
a = Math.imul(L, se);
i = i + Math.imul(U, oe) | 0;
n = (n = n + Math.imul(U, ce) | 0) + Math.imul(D, oe) | 0;
a = a + Math.imul(D, ce) | 0;
i = i + Math.imul(j, de) | 0;
n = (n = n + Math.imul(j, ue) | 0) + Math.imul(P, de) | 0;
a = a + Math.imul(P, ue) | 0;
var Ce = (c + (i = i + Math.imul(R, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(R, be) | 0) + Math.imul(B, pe) | 0)) << 13) | 0;
c = ((a = a + Math.imul(B, be) | 0) + (n >>> 13) | 0) + (Ce >>> 26) | 0;
Ce &= 67108863;
i = Math.imul(O, oe);
n = (n = Math.imul(O, ce)) + Math.imul(L, oe) | 0;
a = Math.imul(L, ce);
i = i + Math.imul(U, de) | 0;
n = (n = n + Math.imul(U, ue) | 0) + Math.imul(D, de) | 0;
a = a + Math.imul(D, ue) | 0;
var je = (c + (i = i + Math.imul(j, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(j, be) | 0) + Math.imul(P, pe) | 0)) << 13) | 0;
c = ((a = a + Math.imul(P, be) | 0) + (n >>> 13) | 0) + (je >>> 26) | 0;
je &= 67108863;
i = Math.imul(O, de);
n = (n = Math.imul(O, ue)) + Math.imul(L, de) | 0;
a = Math.imul(L, ue);
var Pe = (c + (i = i + Math.imul(U, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(U, be) | 0) + Math.imul(D, pe) | 0)) << 13) | 0;
c = ((a = a + Math.imul(D, be) | 0) + (n >>> 13) | 0) + (Pe >>> 26) | 0;
Pe &= 67108863;
var Te = (c + (i = Math.imul(O, pe)) | 0) + ((8191 & (n = (n = Math.imul(O, be)) + Math.imul(L, pe) | 0)) << 13) | 0;
c = ((a = Math.imul(L, be)) + (n >>> 13) | 0) + (Te >>> 26) | 0;
Te &= 67108863;
o[0] = ge;
o[1] = me;
o[2] = ye;
o[3] = ve;
o[4] = _e;
o[5] = we;
o[6] = Se;
o[7] = Ee;
o[8] = Me;
o[9] = ke;
o[10] = Ae;
o[11] = xe;
o[12] = Ie;
o[13] = Re;
o[14] = Be;
o[15] = Ce;
o[16] = je;
o[17] = Pe;
o[18] = Te;
if (0 !== c) {
o[19] = c;
r.length++;
}
return r;
};
Math.imul || (l = u);
function p(e, t, r) {
return new b().mulp(e, t, r);
}
a.prototype.mulTo = function(e, t) {
var r = this.length + e.length;
return 10 === this.length && 10 === e.length ? l(this, e, t) : r < 63 ? u(this, e, t) : r < 1024 ? function(e, t, r) {
r.negative = t.negative ^ e.negative;
r.length = e.length + t.length;
for (var i = 0, n = 0, a = 0; a < r.length - 1; a++) {
var s = n;
n = 0;
for (var f = 67108863 & i, o = Math.min(a, t.length - 1), c = Math.max(0, a - e.length + 1); c <= o; c++) {
var h = a - c, d = (0 | e.words[h]) * (0 | t.words[c]), u = 67108863 & d;
f = 67108863 & (u = u + f | 0);
n += (s = (s = s + (d / 67108864 | 0) | 0) + (u >>> 26) | 0) >>> 26;
s &= 67108863;
}
r.words[a] = f;
i = s;
s = n;
}
0 !== i ? r.words[a] = i : r.length--;
return r.strip();
}(this, e, t) : p(this, e, t);
};
function b(e, t) {
this.x = e;
this.y = t;
}
b.prototype.makeRBT = function(e) {
for (var t = new Array(e), r = a.prototype._countBits(e) - 1, i = 0; i < e; i++) t[i] = this.revBin(i, r, e);
return t;
};
b.prototype.revBin = function(e, t, r) {
if (0 === e || e === r - 1) return e;
for (var i = 0, n = 0; n < t; n++) {
i |= (1 & e) << t - n - 1;
e >>= 1;
}
return i;
};
b.prototype.permute = function(e, t, r, i, n, a) {
for (var s = 0; s < a; s++) {
i[s] = t[e[s]];
n[s] = r[e[s]];
}
};
b.prototype.transform = function(e, t, r, i, n, a) {
this.permute(a, e, t, r, i, n);
for (var s = 1; s < n; s <<= 1) for (var f = s << 1, o = Math.cos(2 * Math.PI / f), c = Math.sin(2 * Math.PI / f), h = 0; h < n; h += f) for (var d = o, u = c, l = 0; l < s; l++) {
var p = r[h + l], b = i[h + l], g = r[h + l + s], m = i[h + l + s], y = d * g - u * m;
m = d * m + u * g;
g = y;
r[h + l] = p + g;
i[h + l] = b + m;
r[h + l + s] = p - g;
i[h + l + s] = b - m;
if (l !== f) {
y = o * d - c * u;
u = o * u + c * d;
d = y;
}
}
};
b.prototype.guessLen13b = function(e, t) {
var r = 1 | Math.max(t, e), i = 1 & r, n = 0;
for (r = r / 2 | 0; r; r >>>= 1) n++;
return 1 << n + 1 + i;
};
b.prototype.conjugate = function(e, t, r) {
if (!(r <= 1)) for (var i = 0; i < r / 2; i++) {
var n = e[i];
e[i] = e[r - i - 1];
e[r - i - 1] = n;
n = t[i];
t[i] = -t[r - i - 1];
t[r - i - 1] = -n;
}
};
b.prototype.normalize13b = function(e, t) {
for (var r = 0, i = 0; i < t / 2; i++) {
var n = 8192 * Math.round(e[2 * i + 1] / t) + Math.round(e[2 * i] / t) + r;
e[i] = 67108863 & n;
r = n < 67108864 ? 0 : n / 67108864 | 0;
}
return e;
};
b.prototype.convert13b = function(e, t, r, n) {
for (var a = 0, s = 0; s < t; s++) {
a += 0 | e[s];
r[2 * s] = 8191 & a;
a >>>= 13;
r[2 * s + 1] = 8191 & a;
a >>>= 13;
}
for (s = 2 * t; s < n; ++s) r[s] = 0;
i(0 === a);
i(0 == (-8192 & a));
};
b.prototype.stub = function(e) {
for (var t = new Array(e), r = 0; r < e; r++) t[r] = 0;
return t;
};
b.prototype.mulp = function(e, t, r) {
var i = 2 * this.guessLen13b(e.length, t.length), n = this.makeRBT(i), a = this.stub(i), s = new Array(i), f = new Array(i), o = new Array(i), c = new Array(i), h = new Array(i), d = new Array(i), u = r.words;
u.length = i;
this.convert13b(e.words, e.length, s, i);
this.convert13b(t.words, t.length, c, i);
this.transform(s, a, f, o, i, n);
this.transform(c, a, h, d, i, n);
for (var l = 0; l < i; l++) {
var p = f[l] * h[l] - o[l] * d[l];
o[l] = f[l] * d[l] + o[l] * h[l];
f[l] = p;
}
this.conjugate(f, o, i);
this.transform(f, o, u, a, i, n);
this.conjugate(u, a, i);
this.normalize13b(u, i);
r.negative = e.negative ^ t.negative;
r.length = e.length + t.length;
return r.strip();
};
a.prototype.mul = function(e) {
var t = new a(null);
t.words = new Array(this.length + e.length);
return this.mulTo(e, t);
};
a.prototype.mulf = function(e) {
var t = new a(null);
t.words = new Array(this.length + e.length);
return p(this, e, t);
};
a.prototype.imul = function(e) {
return this.clone().mulTo(e, this);
};
a.prototype.imuln = function(e) {
i("number" == typeof e);
i(e < 67108864);
for (var t = 0, r = 0; r < this.length; r++) {
var n = (0 | this.words[r]) * e, a = (67108863 & n) + (67108863 & t);
t >>= 26;
t += n / 67108864 | 0;
t += a >>> 26;
this.words[r] = 67108863 & a;
}
if (0 !== t) {
this.words[r] = t;
this.length++;
}
return this;
};
a.prototype.muln = function(e) {
return this.clone().imuln(e);
};
a.prototype.sqr = function() {
return this.mul(this);
};
a.prototype.isqr = function() {
return this.imul(this.clone());
};
a.prototype.pow = function(e) {
var t = function(e) {
for (var t = new Array(e.bitLength()), r = 0; r < t.length; r++) {
var i = r / 26 | 0, n = r % 26;
t[r] = (e.words[i] & 1 << n) >>> n;
}
return t;
}(e);
if (0 === t.length) return new a(1);
for (var r = this, i = 0; i < t.length && 0 === t[i]; i++, r = r.sqr()) ;
if (++i < t.length) for (var n = r.sqr(); i < t.length; i++, n = n.sqr()) 0 !== t[i] && (r = r.mul(n));
return r;
};
a.prototype.iushln = function(e) {
i("number" == typeof e && e >= 0);
var t, r = e % 26, n = (e - r) / 26, a = 67108863 >>> 26 - r << 26 - r;
if (0 !== r) {
var s = 0;
for (t = 0; t < this.length; t++) {
var f = this.words[t] & a, o = (0 | this.words[t]) - f << r;
this.words[t] = o | s;
s = f >>> 26 - r;
}
if (s) {
this.words[t] = s;
this.length++;
}
}
if (0 !== n) {
for (t = this.length - 1; t >= 0; t--) this.words[t + n] = this.words[t];
for (t = 0; t < n; t++) this.words[t] = 0;
this.length += n;
}
return this.strip();
};
a.prototype.ishln = function(e) {
i(0 === this.negative);
return this.iushln(e);
};
a.prototype.iushrn = function(e, t, r) {
i("number" == typeof e && e >= 0);
var n;
n = t ? (t - t % 26) / 26 : 0;
var a = e % 26, s = Math.min((e - a) / 26, this.length), f = 67108863 ^ 67108863 >>> a << a, o = r;
n -= s;
n = Math.max(0, n);
if (o) {
for (var c = 0; c < s; c++) o.words[c] = this.words[c];
o.length = s;
}
if (0 === s) ; else if (this.length > s) {
this.length -= s;
for (c = 0; c < this.length; c++) this.words[c] = this.words[c + s];
} else {
this.words[0] = 0;
this.length = 1;
}
var h = 0;
for (c = this.length - 1; c >= 0 && (0 !== h || c >= n); c--) {
var d = 0 | this.words[c];
this.words[c] = h << 26 - a | d >>> a;
h = d & f;
}
o && 0 !== h && (o.words[o.length++] = h);
if (0 === this.length) {
this.words[0] = 0;
this.length = 1;
}
return this.strip();
};
a.prototype.ishrn = function(e, t, r) {
i(0 === this.negative);
return this.iushrn(e, t, r);
};
a.prototype.shln = function(e) {
return this.clone().ishln(e);
};
a.prototype.ushln = function(e) {
return this.clone().iushln(e);
};
a.prototype.shrn = function(e) {
return this.clone().ishrn(e);
};
a.prototype.ushrn = function(e) {
return this.clone().iushrn(e);
};
a.prototype.testn = function(e) {
i("number" == typeof e && e >= 0);
var t = e % 26, r = (e - t) / 26, n = 1 << t;
return !(this.length <= r) && !!(this.words[r] & n);
};
a.prototype.imaskn = function(e) {
i("number" == typeof e && e >= 0);
var t = e % 26, r = (e - t) / 26;
i(0 === this.negative, "imaskn works only with positive numbers");
if (this.length <= r) return this;
0 !== t && r++;
this.length = Math.min(r, this.length);
if (0 !== t) {
var n = 67108863 ^ 67108863 >>> t << t;
this.words[this.length - 1] &= n;
}
return this.strip();
};
a.prototype.maskn = function(e) {
return this.clone().imaskn(e);
};
a.prototype.iaddn = function(e) {
i("number" == typeof e);
i(e < 67108864);
if (e < 0) return this.isubn(-e);
if (0 !== this.negative) {
if (1 === this.length && (0 | this.words[0]) < e) {
this.words[0] = e - (0 | this.words[0]);
this.negative = 0;
return this;
}
this.negative = 0;
this.isubn(e);
this.negative = 1;
return this;
}
return this._iaddn(e);
};
a.prototype._iaddn = function(e) {
this.words[0] += e;
for (var t = 0; t < this.length && this.words[t] >= 67108864; t++) {
this.words[t] -= 67108864;
t === this.length - 1 ? this.words[t + 1] = 1 : this.words[t + 1]++;
}
this.length = Math.max(this.length, t + 1);
return this;
};
a.prototype.isubn = function(e) {
i("number" == typeof e);
i(e < 67108864);
if (e < 0) return this.iaddn(-e);
if (0 !== this.negative) {
this.negative = 0;
this.iaddn(e);
this.negative = 1;
return this;
}
this.words[0] -= e;
if (1 === this.length && this.words[0] < 0) {
this.words[0] = -this.words[0];
this.negative = 1;
} else for (var t = 0; t < this.length && this.words[t] < 0; t++) {
this.words[t] += 67108864;
this.words[t + 1] -= 1;
}
return this.strip();
};
a.prototype.addn = function(e) {
return this.clone().iaddn(e);
};
a.prototype.subn = function(e) {
return this.clone().isubn(e);
};
a.prototype.iabs = function() {
this.negative = 0;
return this;
};
a.prototype.abs = function() {
return this.clone().iabs();
};
a.prototype._ishlnsubmul = function(e, t, r) {
var n, a, s = e.length + r;
this._expand(s);
var f = 0;
for (n = 0; n < e.length; n++) {
a = (0 | this.words[n + r]) + f;
var o = (0 | e.words[n]) * t;
f = ((a -= 67108863 & o) >> 26) - (o / 67108864 | 0);
this.words[n + r] = 67108863 & a;
}
for (;n < this.length - r; n++) {
f = (a = (0 | this.words[n + r]) + f) >> 26;
this.words[n + r] = 67108863 & a;
}
if (0 === f) return this.strip();
i(-1 === f);
f = 0;
for (n = 0; n < this.length; n++) {
f = (a = -(0 | this.words[n]) + f) >> 26;
this.words[n] = 67108863 & a;
}
this.negative = 1;
return this.strip();
};
a.prototype._wordDiv = function(e, t) {
var r = (this.length, e.length), i = this.clone(), n = e, s = 0 | n.words[n.length - 1];
if (0 !== (r = 26 - this._countBits(s))) {
n = n.ushln(r);
i.iushln(r);
s = 0 | n.words[n.length - 1];
}
var f, o = i.length - n.length;
if ("mod" !== t) {
(f = new a(null)).length = o + 1;
f.words = new Array(f.length);
for (var c = 0; c < f.length; c++) f.words[c] = 0;
}
var h = i.clone()._ishlnsubmul(n, 1, o);
if (0 === h.negative) {
i = h;
f && (f.words[o] = 1);
}
for (var d = o - 1; d >= 0; d--) {
var u = 67108864 * (0 | i.words[n.length + d]) + (0 | i.words[n.length + d - 1]);
u = Math.min(u / s | 0, 67108863);
i._ishlnsubmul(n, u, d);
for (;0 !== i.negative; ) {
u--;
i.negative = 0;
i._ishlnsubmul(n, 1, d);
i.isZero() || (i.negative ^= 1);
}
f && (f.words[d] = u);
}
f && f.strip();
i.strip();
"div" !== t && 0 !== r && i.iushrn(r);
return {
div: f || null,
mod: i
};
};
a.prototype.divmod = function(e, t, r) {
i(!e.isZero());
if (this.isZero()) return {
div: new a(0),
mod: new a(0)
};
var n, s, f;
if (0 !== this.negative && 0 === e.negative) {
f = this.neg().divmod(e, t);
"mod" !== t && (n = f.div.neg());
if ("div" !== t) {
s = f.mod.neg();
r && 0 !== s.negative && s.iadd(e);
}
return {
div: n,
mod: s
};
}
if (0 === this.negative && 0 !== e.negative) {
f = this.divmod(e.neg(), t);
"mod" !== t && (n = f.div.neg());
return {
div: n,
mod: f.mod
};
}
if (0 != (this.negative & e.negative)) {
f = this.neg().divmod(e.neg(), t);
if ("div" !== t) {
s = f.mod.neg();
r && 0 !== s.negative && s.isub(e);
}
return {
div: f.div,
mod: s
};
}
return e.length > this.length || this.cmp(e) < 0 ? {
div: new a(0),
mod: this
} : 1 === e.length ? "div" === t ? {
div: this.divn(e.words[0]),
mod: null
} : "mod" === t ? {
div: null,
mod: new a(this.modn(e.words[0]))
} : {
div: this.divn(e.words[0]),
mod: new a(this.modn(e.words[0]))
} : this._wordDiv(e, t);
};
a.prototype.div = function(e) {
return this.divmod(e, "div", !1).div;
};
a.prototype.mod = function(e) {
return this.divmod(e, "mod", !1).mod;
};
a.prototype.umod = function(e) {
return this.divmod(e, "mod", !0).mod;
};
a.prototype.divRound = function(e) {
var t = this.divmod(e);
if (t.mod.isZero()) return t.div;
var r = 0 !== t.div.negative ? t.mod.isub(e) : t.mod, i = e.ushrn(1), n = e.andln(1), a = r.cmp(i);
return a < 0 || 1 === n && 0 === a ? t.div : 0 !== t.div.negative ? t.div.isubn(1) : t.div.iaddn(1);
};
a.prototype.modn = function(e) {
i(e <= 67108863);
for (var t = (1 << 26) % e, r = 0, n = this.length - 1; n >= 0; n--) r = (t * r + (0 | this.words[n])) % e;
return r;
};
a.prototype.idivn = function(e) {
i(e <= 67108863);
for (var t = 0, r = this.length - 1; r >= 0; r--) {
var n = (0 | this.words[r]) + 67108864 * t;
this.words[r] = n / e | 0;
t = n % e;
}
return this.strip();
};
a.prototype.divn = function(e) {
return this.clone().idivn(e);
};
a.prototype.egcd = function(e) {
i(0 === e.negative);
i(!e.isZero());
var t = this, r = e.clone();
t = 0 !== t.negative ? t.umod(e) : t.clone();
for (var n = new a(1), s = new a(0), f = new a(0), o = new a(1), c = 0; t.isEven() && r.isEven(); ) {
t.iushrn(1);
r.iushrn(1);
++c;
}
for (var h = r.clone(), d = t.clone(); !t.isZero(); ) {
for (var u = 0, l = 1; 0 == (t.words[0] & l) && u < 26; ++u, l <<= 1) ;
if (u > 0) {
t.iushrn(u);
for (;u-- > 0; ) {
if (n.isOdd() || s.isOdd()) {
n.iadd(h);
s.isub(d);
}
n.iushrn(1);
s.iushrn(1);
}
}
for (var p = 0, b = 1; 0 == (r.words[0] & b) && p < 26; ++p, b <<= 1) ;
if (p > 0) {
r.iushrn(p);
for (;p-- > 0; ) {
if (f.isOdd() || o.isOdd()) {
f.iadd(h);
o.isub(d);
}
f.iushrn(1);
o.iushrn(1);
}
}
if (t.cmp(r) >= 0) {
t.isub(r);
n.isub(f);
s.isub(o);
} else {
r.isub(t);
f.isub(n);
o.isub(s);
}
}
return {
a: f,
b: o,
gcd: r.iushln(c)
};
};
a.prototype._invmp = function(e) {
i(0 === e.negative);
i(!e.isZero());
var t = this, r = e.clone();
t = 0 !== t.negative ? t.umod(e) : t.clone();
for (var n, s = new a(1), f = new a(0), o = r.clone(); t.cmpn(1) > 0 && r.cmpn(1) > 0; ) {
for (var c = 0, h = 1; 0 == (t.words[0] & h) && c < 26; ++c, h <<= 1) ;
if (c > 0) {
t.iushrn(c);
for (;c-- > 0; ) {
s.isOdd() && s.iadd(o);
s.iushrn(1);
}
}
for (var d = 0, u = 1; 0 == (r.words[0] & u) && d < 26; ++d, u <<= 1) ;
if (d > 0) {
r.iushrn(d);
for (;d-- > 0; ) {
f.isOdd() && f.iadd(o);
f.iushrn(1);
}
}
if (t.cmp(r) >= 0) {
t.isub(r);
s.isub(f);
} else {
r.isub(t);
f.isub(s);
}
}
(n = 0 === t.cmpn(1) ? s : f).cmpn(0) < 0 && n.iadd(e);
return n;
};
a.prototype.gcd = function(e) {
if (this.isZero()) return e.abs();
if (e.isZero()) return this.abs();
var t = this.clone(), r = e.clone();
t.negative = 0;
r.negative = 0;
for (var i = 0; t.isEven() && r.isEven(); i++) {
t.iushrn(1);
r.iushrn(1);
}
for (;;) {
for (;t.isEven(); ) t.iushrn(1);
for (;r.isEven(); ) r.iushrn(1);
var n = t.cmp(r);
if (n < 0) {
var a = t;
t = r;
r = a;
} else if (0 === n || 0 === r.cmpn(1)) break;
t.isub(r);
}
return r.iushln(i);
};
a.prototype.invm = function(e) {
return this.egcd(e).a.umod(e);
};
a.prototype.isEven = function() {
return 0 == (1 & this.words[0]);
};
a.prototype.isOdd = function() {
return 1 == (1 & this.words[0]);
};
a.prototype.andln = function(e) {
return this.words[0] & e;
};
a.prototype.bincn = function(e) {
i("number" == typeof e);
var t = e % 26, r = (e - t) / 26, n = 1 << t;
if (this.length <= r) {
this._expand(r + 1);
this.words[r] |= n;
return this;
}
for (var a = n, s = r; 0 !== a && s < this.length; s++) {
var f = 0 | this.words[s];
a = (f += a) >>> 26;
f &= 67108863;
this.words[s] = f;
}
if (0 !== a) {
this.words[s] = a;
this.length++;
}
return this;
};
a.prototype.isZero = function() {
return 1 === this.length && 0 === this.words[0];
};
a.prototype.cmpn = function(e) {
var t, r = e < 0;
if (0 !== this.negative && !r) return -1;
if (0 === this.negative && r) return 1;
this.strip();
if (this.length > 1) t = 1; else {
r && (e = -e);
i(e <= 67108863, "Number is too big");
var n = 0 | this.words[0];
t = n === e ? 0 : n < e ? -1 : 1;
}
return 0 !== this.negative ? 0 | -t : t;
};
a.prototype.cmp = function(e) {
if (0 !== this.negative && 0 === e.negative) return -1;
if (0 === this.negative && 0 !== e.negative) return 1;
var t = this.ucmp(e);
return 0 !== this.negative ? 0 | -t : t;
};
a.prototype.ucmp = function(e) {
if (this.length > e.length) return 1;
if (this.length < e.length) return -1;
for (var t = 0, r = this.length - 1; r >= 0; r--) {
var i = 0 | this.words[r], n = 0 | e.words[r];
if (i !== n) {
i < n ? t = -1 : i > n && (t = 1);
break;
}
}
return t;
};
a.prototype.gtn = function(e) {
return 1 === this.cmpn(e);
};
a.prototype.gt = function(e) {
return 1 === this.cmp(e);
};
a.prototype.gten = function(e) {
return this.cmpn(e) >= 0;
};
a.prototype.gte = function(e) {
return this.cmp(e) >= 0;
};
a.prototype.ltn = function(e) {
return -1 === this.cmpn(e);
};
a.prototype.lt = function(e) {
return -1 === this.cmp(e);
};
a.prototype.lten = function(e) {
return this.cmpn(e) <= 0;
};
a.prototype.lte = function(e) {
return this.cmp(e) <= 0;
};
a.prototype.eqn = function(e) {
return 0 === this.cmpn(e);
};
a.prototype.eq = function(e) {
return 0 === this.cmp(e);
};
a.red = function(e) {
return new S(e);
};
a.prototype.toRed = function(e) {
i(!this.red, "Already a number in reduction context");
i(0 === this.negative, "red works only with positives");
return e.convertTo(this)._forceRed(e);
};
a.prototype.fromRed = function() {
i(this.red, "fromRed works only with numbers in reduction context");
return this.red.convertFrom(this);
};
a.prototype._forceRed = function(e) {
this.red = e;
return this;
};
a.prototype.forceRed = function(e) {
i(!this.red, "Already a number in reduction context");
return this._forceRed(e);
};
a.prototype.redAdd = function(e) {
i(this.red, "redAdd works only with red numbers");
return this.red.add(this, e);
};
a.prototype.redIAdd = function(e) {
i(this.red, "redIAdd works only with red numbers");
return this.red.iadd(this, e);
};
a.prototype.redSub = function(e) {
i(this.red, "redSub works only with red numbers");
return this.red.sub(this, e);
};
a.prototype.redISub = function(e) {
i(this.red, "redISub works only with red numbers");
return this.red.isub(this, e);
};
a.prototype.redShl = function(e) {
i(this.red, "redShl works only with red numbers");
return this.red.shl(this, e);
};
a.prototype.redMul = function(e) {
i(this.red, "redMul works only with red numbers");
this.red._verify2(this, e);
return this.red.mul(this, e);
};
a.prototype.redIMul = function(e) {
i(this.red, "redMul works only with red numbers");
this.red._verify2(this, e);
return this.red.imul(this, e);
};
a.prototype.redSqr = function() {
i(this.red, "redSqr works only with red numbers");
this.red._verify1(this);
return this.red.sqr(this);
};
a.prototype.redISqr = function() {
i(this.red, "redISqr works only with red numbers");
this.red._verify1(this);
return this.red.isqr(this);
};
a.prototype.redSqrt = function() {
i(this.red, "redSqrt works only with red numbers");
this.red._verify1(this);
return this.red.sqrt(this);
};
a.prototype.redInvm = function() {
i(this.red, "redInvm works only with red numbers");
this.red._verify1(this);
return this.red.invm(this);
};
a.prototype.redNeg = function() {
i(this.red, "redNeg works only with red numbers");
this.red._verify1(this);
return this.red.neg(this);
};
a.prototype.redPow = function(e) {
i(this.red && !e.red, "redPow(normalNum)");
this.red._verify1(this);
return this.red.pow(this, e);
};
var g = {
k256: null,
p224: null,
p192: null,
p25519: null
};
function m(e, t) {
this.name = e;
this.p = new a(t, 16);
this.n = this.p.bitLength();
this.k = new a(1).iushln(this.n).isub(this.p);
this.tmp = this._tmp();
}
m.prototype._tmp = function() {
var e = new a(null);
e.words = new Array(Math.ceil(this.n / 13));
return e;
};
m.prototype.ireduce = function(e) {
var t, r = e;
do {
this.split(r, this.tmp);
t = (r = (r = this.imulK(r)).iadd(this.tmp)).bitLength();
} while (t > this.n);
var i = t < this.n ? -1 : r.ucmp(this.p);
if (0 === i) {
r.words[0] = 0;
r.length = 1;
} else i > 0 ? r.isub(this.p) : r.strip();
return r;
};
m.prototype.split = function(e, t) {
e.iushrn(this.n, 0, t);
};
m.prototype.imulK = function(e) {
return e.imul(this.k);
};
function y() {
m.call(this, "k256", "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f");
}
n(y, m);
y.prototype.split = function(e, t) {
for (var r = Math.min(e.length, 9), i = 0; i < r; i++) t.words[i] = e.words[i];
t.length = r;
if (e.length <= 9) {
e.words[0] = 0;
e.length = 1;
} else {
var n = e.words[9];
t.words[t.length++] = 4194303 & n;
for (i = 10; i < e.length; i++) {
var a = 0 | e.words[i];
e.words[i - 10] = (4194303 & a) << 4 | n >>> 22;
n = a;
}
n >>>= 22;
e.words[i - 10] = n;
0 === n && e.length > 10 ? e.length -= 10 : e.length -= 9;
}
};
y.prototype.imulK = function(e) {
e.words[e.length] = 0;
e.words[e.length + 1] = 0;
e.length += 2;
for (var t = 0, r = 0; r < e.length; r++) {
var i = 0 | e.words[r];
t += 977 * i;
e.words[r] = 67108863 & t;
t = 64 * i + (t / 67108864 | 0);
}
if (0 === e.words[e.length - 1]) {
e.length--;
0 === e.words[e.length - 1] && e.length--;
}
return e;
};
function v() {
m.call(this, "p224", "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001");
}
n(v, m);
function _() {
m.call(this, "p192", "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff");
}
n(_, m);
function w() {
m.call(this, "25519", "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed");
}
n(w, m);
w.prototype.imulK = function(e) {
for (var t = 0, r = 0; r < e.length; r++) {
var i = 19 * (0 | e.words[r]) + t, n = 67108863 & i;
i >>>= 26;
e.words[r] = n;
t = i;
}
0 !== t && (e.words[e.length++] = t);
return e;
};
a._prime = function(e) {
if (g[e]) return g[e];
var t;
if ("k256" === e) t = new y(); else if ("p224" === e) t = new v(); else if ("p192" === e) t = new _(); else {
if ("p25519" !== e) throw new Error("Unknown prime " + e);
t = new w();
}
g[e] = t;
return t;
};
function S(e) {
if ("string" == typeof e) {
var t = a._prime(e);
this.m = t.p;
this.prime = t;
} else {
i(e.gtn(1), "modulus must be greater than 1");
this.m = e;
this.prime = null;
}
}
S.prototype._verify1 = function(e) {
i(0 === e.negative, "red works only with positives");
i(e.red, "red works only with red numbers");
};
S.prototype._verify2 = function(e, t) {
i(0 == (e.negative | t.negative), "red works only with positives");
i(e.red && e.red === t.red, "red works only with red numbers");
};
S.prototype.imod = function(e) {
return this.prime ? this.prime.ireduce(e)._forceRed(this) : e.umod(this.m)._forceRed(this);
};
S.prototype.neg = function(e) {
return e.isZero() ? e.clone() : this.m.sub(e)._forceRed(this);
};
S.prototype.add = function(e, t) {
this._verify2(e, t);
var r = e.add(t);
r.cmp(this.m) >= 0 && r.isub(this.m);
return r._forceRed(this);
};
S.prototype.iadd = function(e, t) {
this._verify2(e, t);
var r = e.iadd(t);
r.cmp(this.m) >= 0 && r.isub(this.m);
return r;
};
S.prototype.sub = function(e, t) {
this._verify2(e, t);
var r = e.sub(t);
r.cmpn(0) < 0 && r.iadd(this.m);
return r._forceRed(this);
};
S.prototype.isub = function(e, t) {
this._verify2(e, t);
var r = e.isub(t);
r.cmpn(0) < 0 && r.iadd(this.m);
return r;
};
S.prototype.shl = function(e, t) {
this._verify1(e);
return this.imod(e.ushln(t));
};
S.prototype.imul = function(e, t) {
this._verify2(e, t);
return this.imod(e.imul(t));
};
S.prototype.mul = function(e, t) {
this._verify2(e, t);
return this.imod(e.mul(t));
};
S.prototype.isqr = function(e) {
return this.imul(e, e.clone());
};
S.prototype.sqr = function(e) {
return this.mul(e, e);
};
S.prototype.sqrt = function(e) {
if (e.isZero()) return e.clone();
var t = this.m.andln(3);
i(t % 2 == 1);
if (3 === t) {
var r = this.m.add(new a(1)).iushrn(2);
return this.pow(e, r);
}
for (var n = this.m.subn(1), s = 0; !n.isZero() && 0 === n.andln(1); ) {
s++;
n.iushrn(1);
}
i(!n.isZero());
var f = new a(1).toRed(this), o = f.redNeg(), c = this.m.subn(1).iushrn(1), h = this.m.bitLength();
h = new a(2 * h * h).toRed(this);
for (;0 !== this.pow(h, c).cmp(o); ) h.redIAdd(o);
for (var d = this.pow(h, n), u = this.pow(e, n.addn(1).iushrn(1)), l = this.pow(e, n), p = s; 0 !== l.cmp(f); ) {
for (var b = l, g = 0; 0 !== b.cmp(f); g++) b = b.redSqr();
i(g < p);
var m = this.pow(d, new a(1).iushln(p - g - 1));
u = u.redMul(m);
d = m.redSqr();
l = l.redMul(d);
p = g;
}
return u;
};
S.prototype.invm = function(e) {
var t = e._invmp(this.m);
if (0 !== t.negative) {
t.negative = 0;
return this.imod(t).redNeg();
}
return this.imod(t);
};
S.prototype.pow = function(e, t) {
if (t.isZero()) return new a(1).toRed(this);
if (0 === t.cmpn(1)) return e.clone();
var r = new Array(16);
r[0] = new a(1).toRed(this);
r[1] = e;
for (var i = 2; i < r.length; i++) r[i] = this.mul(r[i - 1], e);
var n = r[0], s = 0, f = 0, o = t.bitLength() % 26;
0 === o && (o = 26);
for (i = t.length - 1; i >= 0; i--) {
for (var c = t.words[i], h = o - 1; h >= 0; h--) {
var d = c >> h & 1;
n !== r[0] && (n = this.sqr(n));
if (0 !== d || 0 !== s) {
s <<= 1;
s |= d;
if (4 === ++f || 0 === i && 0 === h) {
n = this.mul(n, r[s]);
f = 0;
s = 0;
}
} else f = 0;
}
o = 26;
}
return n;
};
S.prototype.convertTo = function(e) {
var t = e.umod(this.m);
return t === e ? t.clone() : t;
};
S.prototype.convertFrom = function(e) {
var t = e.clone();
t.red = null;
return t;
};
a.mont = function(e) {
return new E(e);
};
function E(e) {
S.call(this, e);
this.shift = this.m.bitLength();
this.shift % 26 != 0 && (this.shift += 26 - this.shift % 26);
this.r = new a(1).iushln(this.shift);
this.r2 = this.imod(this.r.sqr());
this.rinv = this.r._invmp(this.m);
this.minv = this.rinv.mul(this.r).isubn(1).div(this.m);
this.minv = this.minv.umod(this.r);
this.minv = this.r.sub(this.minv);
}
n(E, S);
E.prototype.convertTo = function(e) {
return this.imod(e.ushln(this.shift));
};
E.prototype.convertFrom = function(e) {
var t = this.imod(e.mul(this.rinv));
t.red = null;
return t;
};
E.prototype.imul = function(e, t) {
if (e.isZero() || t.isZero()) {
e.words[0] = 0;
e.length = 1;
return e;
}
var r = e.imul(t), i = r.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), n = r.isub(i).iushrn(this.shift), a = n;
n.cmp(this.m) >= 0 ? a = n.isub(this.m) : n.cmpn(0) < 0 && (a = n.iadd(this.m));
return a._forceRed(this);
};
E.prototype.mul = function(e, t) {
if (e.isZero() || t.isZero()) return new a(0)._forceRed(this);
var r = e.mul(t), i = r.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m), n = r.isub(i).iushrn(this.shift), s = n;
n.cmp(this.m) >= 0 ? s = n.isub(this.m) : n.cmpn(0) < 0 && (s = n.iadd(this.m));
return s._forceRed(this);
};
E.prototype.invm = function(e) {
return this.imod(e._invmp(this.m).mul(this.r2))._forceRed(this);
};
})("undefined" == typeof t || t, this);
}, {
buffer: 18
} ],
17: [ function(e, t, r) {
var i;
t.exports = function(e) {
i || (i = new n(null));
return i.generate(e);
};
function n(e) {
this.rand = e;
}
t.exports.Rand = n;
n.prototype.generate = function(e) {
return this._rand(e);
};
n.prototype._rand = function(e) {
if (this.rand.getBytes) return this.rand.getBytes(e);
for (var t = new Uint8Array(e), r = 0; r < t.length; r++) t[r] = this.rand.getByte();
return t;
};
if ("object" == typeof self) self.crypto && self.crypto.getRandomValues ? n.prototype._rand = function(e) {
var t = new Uint8Array(e);
self.crypto.getRandomValues(t);
return t;
} : self.msCrypto && self.msCrypto.getRandomValues ? n.prototype._rand = function(e) {
var t = new Uint8Array(e);
self.msCrypto.getRandomValues(t);
return t;
} : "object" == typeof window && (n.prototype._rand = function() {
throw new Error("Not implemented yet");
}); else try {
var a = e("crypto");
if ("function" != typeof a.randomBytes) throw new Error("Not supported");
n.prototype._rand = function(e) {
return a.randomBytes(e);
};
} catch (e) {}
}, {
crypto: 18
} ],
18: [ function(e, t, r) {}, {} ],
19: [ function(e, t, r) {
var i = e("safe-buffer").Buffer;
function n(e) {
i.isBuffer(e) || (e = i.from(e));
for (var t = e.length / 4 | 0, r = new Array(t), n = 0; n < t; n++) r[n] = e.readUInt32BE(4 * n);
return r;
}
function a(e) {
for (;0 < e.length; e++) e[0] = 0;
}
function s(e, t, r, i, n) {
for (var a, s, f, o, c = r[0], h = r[1], d = r[2], u = r[3], l = e[0] ^ t[0], p = e[1] ^ t[1], b = e[2] ^ t[2], g = e[3] ^ t[3], m = 4, y = 1; y < n; y++) {
a = c[l >>> 24] ^ h[p >>> 16 & 255] ^ d[b >>> 8 & 255] ^ u[255 & g] ^ t[m++];
s = c[p >>> 24] ^ h[b >>> 16 & 255] ^ d[g >>> 8 & 255] ^ u[255 & l] ^ t[m++];
f = c[b >>> 24] ^ h[g >>> 16 & 255] ^ d[l >>> 8 & 255] ^ u[255 & p] ^ t[m++];
o = c[g >>> 24] ^ h[l >>> 16 & 255] ^ d[p >>> 8 & 255] ^ u[255 & b] ^ t[m++];
l = a;
p = s;
b = f;
g = o;
}
a = (i[l >>> 24] << 24 | i[p >>> 16 & 255] << 16 | i[b >>> 8 & 255] << 8 | i[255 & g]) ^ t[m++];
s = (i[p >>> 24] << 24 | i[b >>> 16 & 255] << 16 | i[g >>> 8 & 255] << 8 | i[255 & l]) ^ t[m++];
f = (i[b >>> 24] << 24 | i[g >>> 16 & 255] << 16 | i[l >>> 8 & 255] << 8 | i[255 & p]) ^ t[m++];
o = (i[g >>> 24] << 24 | i[l >>> 16 & 255] << 16 | i[p >>> 8 & 255] << 8 | i[255 & b]) ^ t[m++];
return [ a >>>= 0, s >>>= 0, f >>>= 0, o >>>= 0 ];
}
var f = [ 0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54 ], o = function() {
for (var e = new Array(256), t = 0; t < 256; t++) e[t] = t < 128 ? t << 1 : t << 1 ^ 283;
for (var r = [], i = [], n = [ [], [], [], [] ], a = [ [], [], [], [] ], s = 0, f = 0, o = 0; o < 256; ++o) {
var c = f ^ f << 1 ^ f << 2 ^ f << 3 ^ f << 4;
c = c >>> 8 ^ 255 & c ^ 99;
r[s] = c;
i[c] = s;
var h = e[s], d = e[h], u = e[d], l = 257 * e[c] ^ 16843008 * c;
n[0][s] = l << 24 | l >>> 8;
n[1][s] = l << 16 | l >>> 16;
n[2][s] = l << 8 | l >>> 24;
n[3][s] = l;
l = 16843009 * u ^ 65537 * d ^ 257 * h ^ 16843008 * s;
a[0][c] = l << 24 | l >>> 8;
a[1][c] = l << 16 | l >>> 16;
a[2][c] = l << 8 | l >>> 24;
a[3][c] = l;
if (0 === s) s = f = 1; else {
s = h ^ e[e[e[u ^ h]]];
f ^= e[e[f]];
}
}
return {
SBOX: r,
INV_SBOX: i,
SUB_MIX: n,
INV_SUB_MIX: a
};
}();
function c(e) {
this._key = n(e);
this._reset();
}
c.blockSize = 16;
c.keySize = 32;
c.prototype.blockSize = c.blockSize;
c.prototype.keySize = c.keySize;
c.prototype._reset = function() {
for (var e = this._key, t = e.length, r = t + 6, i = 4 * (r + 1), n = [], a = 0; a < t; a++) n[a] = e[a];
for (a = t; a < i; a++) {
var s = n[a - 1];
if (a % t == 0) {
s = s << 8 | s >>> 24;
s = o.SBOX[s >>> 24] << 24 | o.SBOX[s >>> 16 & 255] << 16 | o.SBOX[s >>> 8 & 255] << 8 | o.SBOX[255 & s];
s ^= f[a / t | 0] << 24;
} else t > 6 && a % t == 4 && (s = o.SBOX[s >>> 24] << 24 | o.SBOX[s >>> 16 & 255] << 16 | o.SBOX[s >>> 8 & 255] << 8 | o.SBOX[255 & s]);
n[a] = n[a - t] ^ s;
}
for (var c = [], h = 0; h < i; h++) {
var d = i - h, u = n[d - (h % 4 ? 0 : 4)];
c[h] = h < 4 || d <= 4 ? u : o.INV_SUB_MIX[0][o.SBOX[u >>> 24]] ^ o.INV_SUB_MIX[1][o.SBOX[u >>> 16 & 255]] ^ o.INV_SUB_MIX[2][o.SBOX[u >>> 8 & 255]] ^ o.INV_SUB_MIX[3][o.SBOX[255 & u]];
}
this._nRounds = r;
this._keySchedule = n;
this._invKeySchedule = c;
};
c.prototype.encryptBlockRaw = function(e) {
return s(e = n(e), this._keySchedule, o.SUB_MIX, o.SBOX, this._nRounds);
};
c.prototype.encryptBlock = function(e) {
var t = this.encryptBlockRaw(e), r = i.allocUnsafe(16);
r.writeUInt32BE(t[0], 0);
r.writeUInt32BE(t[1], 4);
r.writeUInt32BE(t[2], 8);
r.writeUInt32BE(t[3], 12);
return r;
};
c.prototype.decryptBlock = function(e) {
var t = (e = n(e))[1];
e[1] = e[3];
e[3] = t;
var r = s(e, this._invKeySchedule, o.INV_SUB_MIX, o.INV_SBOX, this._nRounds), a = i.allocUnsafe(16);
a.writeUInt32BE(r[0], 0);
a.writeUInt32BE(r[3], 4);
a.writeUInt32BE(r[2], 8);
a.writeUInt32BE(r[1], 12);
return a;
};
c.prototype.scrub = function() {
a(this._keySchedule);
a(this._invKeySchedule);
a(this._key);
};
t.exports.AES = c;
}, {
"safe-buffer": 143
} ],
20: [ function(e, t, r) {
var i = e("./aes"), n = e("safe-buffer").Buffer, a = e("cipher-base"), s = e("inherits"), f = e("./ghash"), o = e("buffer-xor"), c = e("./incr32");
function h(e, t, r, s) {
a.call(this);
var o = n.alloc(4, 0);
this._cipher = new i.AES(t);
var h = this._cipher.encryptBlock(o);
this._ghash = new f(h);
r = function(e, t, r) {
if (12 === t.length) {
e._finID = n.concat([ t, n.from([ 0, 0, 0, 1 ]) ]);
return n.concat([ t, n.from([ 0, 0, 0, 2 ]) ]);
}
var i = new f(r), a = t.length, s = a % 16;
i.update(t);
if (s) {
s = 16 - s;
i.update(n.alloc(s, 0));
}
i.update(n.alloc(8, 0));
var o = 8 * a, h = n.alloc(8);
h.writeUIntBE(o, 0, 8);
i.update(h);
e._finID = i.state;
var d = n.from(e._finID);
c(d);
return d;
}(this, r, h);
this._prev = n.from(r);
this._cache = n.allocUnsafe(0);
this._secCache = n.allocUnsafe(0);
this._decrypt = s;
this._alen = 0;
this._len = 0;
this._mode = e;
this._authTag = null;
this._called = !1;
}
s(h, a);
h.prototype._update = function(e) {
if (!this._called && this._alen) {
var t = 16 - this._alen % 16;
if (t < 16) {
t = n.alloc(t, 0);
this._ghash.update(t);
}
}
this._called = !0;
var r = this._mode.encrypt(this, e);
this._decrypt ? this._ghash.update(e) : this._ghash.update(r);
this._len += e.length;
return r;
};
h.prototype._final = function() {
if (this._decrypt && !this._authTag) throw new Error("Unsupported state or unable to authenticate data");
var e = o(this._ghash.final(8 * this._alen, 8 * this._len), this._cipher.encryptBlock(this._finID));
if (this._decrypt && function(e, t) {
var r = 0;
e.length !== t.length && r++;
for (var i = Math.min(e.length, t.length), n = 0; n < i; ++n) r += e[n] ^ t[n];
return r;
}(e, this._authTag)) throw new Error("Unsupported state or unable to authenticate data");
this._authTag = e;
this._cipher.scrub();
};
h.prototype.getAuthTag = function() {
if (this._decrypt || !n.isBuffer(this._authTag)) throw new Error("Attempting to get auth tag in unsupported state");
return this._authTag;
};
h.prototype.setAuthTag = function(e) {
if (!this._decrypt) throw new Error("Attempting to set auth tag in unsupported state");
this._authTag = e;
};
h.prototype.setAAD = function(e) {
if (this._called) throw new Error("Attempting to set AAD in unsupported state");
this._ghash.update(e);
this._alen += e.length;
};
t.exports = h;
}, {
"./aes": 19,
"./ghash": 24,
"./incr32": 25,
"buffer-xor": 46,
"cipher-base": 49,
inherits: 101,
"safe-buffer": 143
} ],
21: [ function(e, t, r) {
var i = e("./encrypter"), n = e("./decrypter"), a = e("./modes/list.json");
r.createCipher = r.Cipher = i.createCipher;
r.createCipheriv = r.Cipheriv = i.createCipheriv;
r.createDecipher = r.Decipher = n.createDecipher;
r.createDecipheriv = r.Decipheriv = n.createDecipheriv;
r.listCiphers = r.getCiphers = function() {
return Object.keys(a);
};
}, {
"./decrypter": 22,
"./encrypter": 23,
"./modes/list.json": 33
} ],
22: [ function(e, t, r) {
var i = e("./authCipher"), n = e("safe-buffer").Buffer, a = e("./modes"), s = e("./streamCipher"), f = e("cipher-base"), o = e("./aes"), c = e("evp_bytestokey");
function h(e, t, r) {
f.call(this);
this._cache = new d();
this._last = void 0;
this._cipher = new o.AES(t);
this._prev = n.from(r);
this._mode = e;
this._autopadding = !0;
}
e("inherits")(h, f);
h.prototype._update = function(e) {
this._cache.add(e);
for (var t, r, i = []; t = this._cache.get(this._autopadding); ) {
r = this._mode.decrypt(this, t);
i.push(r);
}
return n.concat(i);
};
h.prototype._final = function() {
var e = this._cache.flush();
if (this._autopadding) return function(e) {
var t = e[15];
if (t < 1 || t > 16) throw new Error("unable to decrypt data");
var r = -1;
for (;++r < t; ) if (e[r + (16 - t)] !== t) throw new Error("unable to decrypt data");
if (16 === t) return;
return e.slice(0, 16 - t);
}(this._mode.decrypt(this, e));
if (e) throw new Error("data not multiple of block length");
};
h.prototype.setAutoPadding = function(e) {
this._autopadding = !!e;
return this;
};
function d() {
this.cache = n.allocUnsafe(0);
}
d.prototype.add = function(e) {
this.cache = n.concat([ this.cache, e ]);
};
d.prototype.get = function(e) {
var t;
if (e) {
if (this.cache.length > 16) {
t = this.cache.slice(0, 16);
this.cache = this.cache.slice(16);
return t;
}
} else if (this.cache.length >= 16) {
t = this.cache.slice(0, 16);
this.cache = this.cache.slice(16);
return t;
}
return null;
};
d.prototype.flush = function() {
if (this.cache.length) return this.cache;
};
function u(e, t, r) {
var f = a[e.toLowerCase()];
if (!f) throw new TypeError("invalid suite type");
"string" == typeof r && (r = n.from(r));
if ("GCM" !== f.mode && r.length !== f.iv) throw new TypeError("invalid iv length " + r.length);
"string" == typeof t && (t = n.from(t));
if (t.length !== f.key / 8) throw new TypeError("invalid key length " + t.length);
return "stream" === f.type ? new s(f.module, t, r, !0) : "auth" === f.type ? new i(f.module, t, r, !0) : new h(f.module, t, r);
}
r.createDecipher = function(e, t) {
var r = a[e.toLowerCase()];
if (!r) throw new TypeError("invalid suite type");
var i = c(t, !1, r.key, r.iv);
return u(e, i.key, i.iv);
};
r.createDecipheriv = u;
}, {
"./aes": 19,
"./authCipher": 20,
"./modes": 32,
"./streamCipher": 35,
"cipher-base": 49,
evp_bytestokey: 84,
inherits: 101,
"safe-buffer": 143
} ],
23: [ function(e, t, r) {
var i = e("./modes"), n = e("./authCipher"), a = e("safe-buffer").Buffer, s = e("./streamCipher"), f = e("cipher-base"), o = e("./aes"), c = e("evp_bytestokey");
function h(e, t, r) {
f.call(this);
this._cache = new u();
this._cipher = new o.AES(t);
this._prev = a.from(r);
this._mode = e;
this._autopadding = !0;
}
e("inherits")(h, f);
h.prototype._update = function(e) {
this._cache.add(e);
for (var t, r, i = []; t = this._cache.get(); ) {
r = this._mode.encrypt(this, t);
i.push(r);
}
return a.concat(i);
};
var d = a.alloc(16, 16);
h.prototype._final = function() {
var e = this._cache.flush();
if (this._autopadding) {
e = this._mode.encrypt(this, e);
this._cipher.scrub();
return e;
}
if (!e.equals(d)) {
this._cipher.scrub();
throw new Error("data not multiple of block length");
}
};
h.prototype.setAutoPadding = function(e) {
this._autopadding = !!e;
return this;
};
function u() {
this.cache = a.allocUnsafe(0);
}
u.prototype.add = function(e) {
this.cache = a.concat([ this.cache, e ]);
};
u.prototype.get = function() {
if (this.cache.length > 15) {
var e = this.cache.slice(0, 16);
this.cache = this.cache.slice(16);
return e;
}
return null;
};
u.prototype.flush = function() {
for (var e = 16 - this.cache.length, t = a.allocUnsafe(e), r = -1; ++r < e; ) t.writeUInt8(e, r);
return a.concat([ this.cache, t ]);
};
function l(e, t, r) {
var f = i[e.toLowerCase()];
if (!f) throw new TypeError("invalid suite type");
"string" == typeof t && (t = a.from(t));
if (t.length !== f.key / 8) throw new TypeError("invalid key length " + t.length);
"string" == typeof r && (r = a.from(r));
if ("GCM" !== f.mode && r.length !== f.iv) throw new TypeError("invalid iv length " + r.length);
return "stream" === f.type ? new s(f.module, t, r) : "auth" === f.type ? new n(f.module, t, r) : new h(f.module, t, r);
}
r.createCipheriv = l;
r.createCipher = function(e, t) {
var r = i[e.toLowerCase()];
if (!r) throw new TypeError("invalid suite type");
var n = c(t, !1, r.key, r.iv);
return l(e, n.key, n.iv);
};
}, {
"./aes": 19,
"./authCipher": 20,
"./modes": 32,
"./streamCipher": 35,
"cipher-base": 49,
evp_bytestokey: 84,
inherits: 101,
"safe-buffer": 143
} ],
24: [ function(e, t, r) {
var i = e("safe-buffer").Buffer, n = i.alloc(16, 0);
function a(e) {
var t = i.allocUnsafe(16);
t.writeUInt32BE(e[0] >>> 0, 0);
t.writeUInt32BE(e[1] >>> 0, 4);
t.writeUInt32BE(e[2] >>> 0, 8);
t.writeUInt32BE(e[3] >>> 0, 12);
return t;
}
function s(e) {
this.h = e;
this.state = i.alloc(16, 0);
this.cache = i.allocUnsafe(0);
}
s.prototype.ghash = function(e) {
for (var t = -1; ++t < e.length; ) this.state[t] ^= e[t];
this._multiply();
};
s.prototype._multiply = function() {
for (var e, t, r = function(e) {
return [ e.readUInt32BE(0), e.readUInt32BE(4), e.readUInt32BE(8), e.readUInt32BE(12) ];
}(this.h), i = [ 0, 0, 0, 0 ], n = -1; ++n < 128; ) {
if (0 != (this.state[~~(n / 8)] & 1 << 7 - n % 8)) {
i[0] ^= r[0];
i[1] ^= r[1];
i[2] ^= r[2];
i[3] ^= r[3];
}
t = 0 != (1 & r[3]);
for (e = 3; e > 0; e--) r[e] = r[e] >>> 1 | (1 & r[e - 1]) << 31;
r[0] = r[0] >>> 1;
t && (r[0] = r[0] ^ 225 << 24);
}
this.state = a(i);
};
s.prototype.update = function(e) {
this.cache = i.concat([ this.cache, e ]);
for (var t; this.cache.length >= 16; ) {
t = this.cache.slice(0, 16);
this.cache = this.cache.slice(16);
this.ghash(t);
}
};
s.prototype.final = function(e, t) {
this.cache.length && this.ghash(i.concat([ this.cache, n ], 16));
this.ghash(a([ 0, e, 0, t ]));
return this.state;
};
t.exports = s;
}, {
"safe-buffer": 143
} ],
25: [ function(e, t, r) {
t.exports = function(e) {
for (var t, r = e.length; r--; ) {
if (255 !== (t = e.readUInt8(r))) {
t++;
e.writeUInt8(t, r);
break;
}
e.writeUInt8(0, r);
}
};
}, {} ],
26: [ function(e, t, r) {
var i = e("buffer-xor");
r.encrypt = function(e, t) {
var r = i(t, e._prev);
e._prev = e._cipher.encryptBlock(r);
return e._prev;
};
r.decrypt = function(e, t) {
var r = e._prev;
e._prev = t;
var n = e._cipher.decryptBlock(t);
return i(n, r);
};
}, {
"buffer-xor": 46
} ],
27: [ function(e, t, r) {
var i = e("safe-buffer").Buffer, n = e("buffer-xor");
function a(e, t, r) {
var a = t.length, s = n(t, e._cache);
e._cache = e._cache.slice(a);
e._prev = i.concat([ e._prev, r ? t : s ]);
return s;
}
r.encrypt = function(e, t, r) {
for (var n, s = i.allocUnsafe(0); t.length; ) {
if (0 === e._cache.length) {
e._cache = e._cipher.encryptBlock(e._prev);
e._prev = i.allocUnsafe(0);
}
if (!(e._cache.length <= t.length)) {
s = i.concat([ s, a(e, t, r) ]);
break;
}
n = e._cache.length;
s = i.concat([ s, a(e, t.slice(0, n), r) ]);
t = t.slice(n);
}
return s;
};
}, {
"buffer-xor": 46,
"safe-buffer": 143
} ],
28: [ function(e, t, r) {
var i = e("safe-buffer").Buffer;
function n(e, t, r) {
for (var i, n, s, f = -1, o = 0; ++f < 8; ) {
i = e._cipher.encryptBlock(e._prev);
n = t & 1 << 7 - f ? 128 : 0;
o += (128 & (s = i[0] ^ n)) >> f % 8;
e._prev = a(e._prev, r ? n : s);
}
return o;
}
function a(e, t) {
var r = e.length, n = -1, a = i.allocUnsafe(e.length);
e = i.concat([ e, i.from([ t ]) ]);
for (;++n < r; ) a[n] = e[n] << 1 | e[n + 1] >> 7;
return a;
}
r.encrypt = function(e, t, r) {
for (var a = t.length, s = i.allocUnsafe(a), f = -1; ++f < a; ) s[f] = n(e, t[f], r);
return s;
};
}, {
"safe-buffer": 143
} ],
29: [ function(e, t, r) {
var i = e("safe-buffer").Buffer;
function n(e, t, r) {
var n = e._cipher.encryptBlock(e._prev)[0] ^ t;
e._prev = i.concat([ e._prev.slice(1), i.from([ r ? t : n ]) ]);
return n;
}
r.encrypt = function(e, t, r) {
for (var a = t.length, s = i.allocUnsafe(a), f = -1; ++f < a; ) s[f] = n(e, t[f], r);
return s;
};
}, {
"safe-buffer": 143
} ],
30: [ function(e, t, r) {
var i = e("buffer-xor"), n = e("safe-buffer").Buffer, a = e("../incr32");
function s(e) {
var t = e._cipher.encryptBlockRaw(e._prev);
a(e._prev);
return t;
}
r.encrypt = function(e, t) {
var r = Math.ceil(t.length / 16), a = e._cache.length;
e._cache = n.concat([ e._cache, n.allocUnsafe(16 * r) ]);
for (var f = 0; f < r; f++) {
var o = s(e), c = a + 16 * f;
e._cache.writeUInt32BE(o[0], c + 0);
e._cache.writeUInt32BE(o[1], c + 4);
e._cache.writeUInt32BE(o[2], c + 8);
e._cache.writeUInt32BE(o[3], c + 12);
}
var h = e._cache.slice(0, t.length);
e._cache = e._cache.slice(t.length);
return i(t, h);
};
}, {
"../incr32": 25,
"buffer-xor": 46,
"safe-buffer": 143
} ],
31: [ function(e, t, r) {
r.encrypt = function(e, t) {
return e._cipher.encryptBlock(t);
};
r.decrypt = function(e, t) {
return e._cipher.decryptBlock(t);
};
}, {} ],
32: [ function(e, t, r) {
var i = {
ECB: e("./ecb"),
CBC: e("./cbc"),
CFB: e("./cfb"),
CFB8: e("./cfb8"),
CFB1: e("./cfb1"),
OFB: e("./ofb"),
CTR: e("./ctr"),
GCM: e("./ctr")
}, n = e("./list.json");
for (var a in n) n[a].module = i[n[a].mode];
t.exports = n;
}, {
"./cbc": 26,
"./cfb": 27,
"./cfb1": 28,
"./cfb8": 29,
"./ctr": 30,
"./ecb": 31,
"./list.json": 33,
"./ofb": 34
} ],
33: [ function(e, t, r) {
t.exports = {
"aes-128-ecb": {
cipher: "AES",
key: 128,
iv: 0,
mode: "ECB",
type: "block"
},
"aes-192-ecb": {
cipher: "AES",
key: 192,
iv: 0,
mode: "ECB",
type: "block"
},
"aes-256-ecb": {
cipher: "AES",
key: 256,
iv: 0,
mode: "ECB",
type: "block"
},
"aes-128-cbc": {
cipher: "AES",
key: 128,
iv: 16,
mode: "CBC",
type: "block"
},
"aes-192-cbc": {
cipher: "AES",
key: 192,
iv: 16,
mode: "CBC",
type: "block"
},
"aes-256-cbc": {
cipher: "AES",
key: 256,
iv: 16,
mode: "CBC",
type: "block"
},
aes128: {
cipher: "AES",
key: 128,
iv: 16,
mode: "CBC",
type: "block"
},
aes192: {
cipher: "AES",
key: 192,
iv: 16,
mode: "CBC",
type: "block"
},
aes256: {
cipher: "AES",
key: 256,
iv: 16,
mode: "CBC",
type: "block"
},
"aes-128-cfb": {
cipher: "AES",
key: 128,
iv: 16,
mode: "CFB",
type: "stream"
},
"aes-192-cfb": {
cipher: "AES",
key: 192,
iv: 16,
mode: "CFB",
type: "stream"
},
"aes-256-cfb": {
cipher: "AES",
key: 256,
iv: 16,
mode: "CFB",
type: "stream"
},
"aes-128-cfb8": {
cipher: "AES",
key: 128,
iv: 16,
mode: "CFB8",
type: "stream"
},
"aes-192-cfb8": {
cipher: "AES",
key: 192,
iv: 16,
mode: "CFB8",
type: "stream"
},
"aes-256-cfb8": {
cipher: "AES",
key: 256,
iv: 16,
mode: "CFB8",
type: "stream"
},
"aes-128-cfb1": {
cipher: "AES",
key: 128,
iv: 16,
mode: "CFB1",
type: "stream"
},
"aes-192-cfb1": {
cipher: "AES",
key: 192,
iv: 16,
mode: "CFB1",
type: "stream"
},
"aes-256-cfb1": {
cipher: "AES",
key: 256,
iv: 16,
mode: "CFB1",
type: "stream"
},
"aes-128-ofb": {
cipher: "AES",
key: 128,
iv: 16,
mode: "OFB",
type: "stream"
},
"aes-192-ofb": {
cipher: "AES",
key: 192,
iv: 16,
mode: "OFB",
type: "stream"
},
"aes-256-ofb": {
cipher: "AES",
key: 256,
iv: 16,
mode: "OFB",
type: "stream"
},
"aes-128-ctr": {
cipher: "AES",
key: 128,
iv: 16,
mode: "CTR",
type: "stream"
},
"aes-192-ctr": {
cipher: "AES",
key: 192,
iv: 16,
mode: "CTR",
type: "stream"
},
"aes-256-ctr": {
cipher: "AES",
key: 256,
iv: 16,
mode: "CTR",
type: "stream"
},
"aes-128-gcm": {
cipher: "AES",
key: 128,
iv: 12,
mode: "GCM",
type: "auth"
},
"aes-192-gcm": {
cipher: "AES",
key: 192,
iv: 12,
mode: "GCM",
type: "auth"
},
"aes-256-gcm": {
cipher: "AES",
key: 256,
iv: 12,
mode: "GCM",
type: "auth"
}
};
}, {} ],
34: [ function(e, t, r) {
(function(t) {
var i = e("buffer-xor");
function n(e) {
e._prev = e._cipher.encryptBlock(e._prev);
return e._prev;
}
r.encrypt = function(e, r) {
for (;e._cache.length < r.length; ) e._cache = t.concat([ e._cache, n(e) ]);
var a = e._cache.slice(0, r.length);
e._cache = e._cache.slice(r.length);
return i(r, a);
};
}).call(this, e("buffer").Buffer);
}, {
buffer: 47,
"buffer-xor": 46
} ],
35: [ function(e, t, r) {
var i = e("./aes"), n = e("safe-buffer").Buffer, a = e("cipher-base");
function s(e, t, r, s) {
a.call(this);
this._cipher = new i.AES(t);
this._prev = n.from(r);
this._cache = n.allocUnsafe(0);
this._secCache = n.allocUnsafe(0);
this._decrypt = s;
this._mode = e;
}
e("inherits")(s, a);
s.prototype._update = function(e) {
return this._mode.encrypt(this, e, this._decrypt);
};
s.prototype._final = function() {
this._cipher.scrub();
};
t.exports = s;
}, {
"./aes": 19,
"cipher-base": 49,
inherits: 101,
"safe-buffer": 143
} ],
36: [ function(e, t, r) {
var i = e("browserify-des"), n = e("browserify-aes/browser"), a = e("browserify-aes/modes"), s = e("browserify-des/modes"), f = e("evp_bytestokey");
function o(e, t, r) {
e = e.toLowerCase();
if (a[e]) return n.createCipheriv(e, t, r);
if (s[e]) return new i({
key: t,
iv: r,
mode: e
});
throw new TypeError("invalid suite type");
}
function c(e, t, r) {
e = e.toLowerCase();
if (a[e]) return n.createDecipheriv(e, t, r);
if (s[e]) return new i({
key: t,
iv: r,
mode: e,
decrypt: !0
});
throw new TypeError("invalid suite type");
}
r.createCipher = r.Cipher = function(e, t) {
e = e.toLowerCase();
var r, i;
if (a[e]) {
r = a[e].key;
i = a[e].iv;
} else {
if (!s[e]) throw new TypeError("invalid suite type");
r = 8 * s[e].key;
i = s[e].iv;
}
var n = f(t, !1, r, i);
return o(e, n.key, n.iv);
};
r.createCipheriv = r.Cipheriv = o;
r.createDecipher = r.Decipher = function(e, t) {
e = e.toLowerCase();
var r, i;
if (a[e]) {
r = a[e].key;
i = a[e].iv;
} else {
if (!s[e]) throw new TypeError("invalid suite type");
r = 8 * s[e].key;
i = s[e].iv;
}
var n = f(t, !1, r, i);
return c(e, n.key, n.iv);
};
r.createDecipheriv = r.Decipheriv = c;
r.listCiphers = r.getCiphers = function() {
return Object.keys(s).concat(n.getCiphers());
};
}, {
"browserify-aes/browser": 21,
"browserify-aes/modes": 32,
"browserify-des": 37,
"browserify-des/modes": 38,
evp_bytestokey: 84
} ],
37: [ function(e, t, r) {
var i = e("cipher-base"), n = e("des.js"), a = e("inherits"), s = e("safe-buffer").Buffer, f = {
"des-ede3-cbc": n.CBC.instantiate(n.EDE),
"des-ede3": n.EDE,
"des-ede-cbc": n.CBC.instantiate(n.EDE),
"des-ede": n.EDE,
"des-cbc": n.CBC.instantiate(n.DES),
"des-ecb": n.DES
};
f.des = f["des-cbc"];
f.des3 = f["des-ede3-cbc"];
t.exports = o;
a(o, i);
function o(e) {
i.call(this);
var t, r = e.mode.toLowerCase(), n = f[r];
t = e.decrypt ? "decrypt" : "encrypt";
var a = e.key;
s.isBuffer(a) || (a = s.from(a));
"des-ede" !== r && "des-ede-cbc" !== r || (a = s.concat([ a, a.slice(0, 8) ]));
var o = e.iv;
s.isBuffer(o) || (o = s.from(o));
this._des = n.create({
key: a,
iv: o,
type: t
});
}
o.prototype._update = function(e) {
return s.from(this._des.update(e));
};
o.prototype._final = function() {
return s.from(this._des.final());
};
}, {
"cipher-base": 49,
"des.js": 57,
inherits: 101,
"safe-buffer": 143
} ],
38: [ function(e, t, r) {
r["des-ecb"] = {
key: 8,
iv: 0
};
r["des-cbc"] = r.des = {
key: 8,
iv: 8
};
r["des-ede3-cbc"] = r.des3 = {
key: 24,
iv: 8
};
r["des-ede3"] = {
key: 24,
iv: 0
};
r["des-ede-cbc"] = {
key: 16,
iv: 8
};
r["des-ede"] = {
key: 16,
iv: 0
};
}, {} ],
39: [ function(e, t, r) {
(function(r) {
var i = e("bn.js"), n = e("randombytes");
t.exports = a;
function a(e, t) {
var n = function(e) {
var t = s(e);
return {
blinder: t.toRed(i.mont(e.modulus)).redPow(new i(e.publicExponent)).fromRed(),
unblinder: t.invm(e.modulus)
};
}(t), a = t.modulus.byteLength(), f = (i.mont(t.modulus), new i(e).mul(n.blinder).umod(t.modulus)), o = f.toRed(i.mont(t.prime1)), c = f.toRed(i.mont(t.prime2)), h = t.coefficient, d = t.prime1, u = t.prime2, l = o.redPow(t.exponent1), p = c.redPow(t.exponent2);
l = l.fromRed();
p = p.fromRed();
var b = l.isub(p).imul(h).umod(d);
b.imul(u);
p.iadd(b);
return new r(p.imul(n.unblinder).umod(t.modulus).toArray(!1, a));
}
a.getr = s;
function s(e) {
for (var t = e.modulus.byteLength(), r = new i(n(t)); r.cmp(e.modulus) >= 0 || !r.umod(e.prime1) || !r.umod(e.prime2); ) r = new i(n(t));
return r;
}
}).call(this, e("buffer").Buffer);
}, {
"bn.js": 16,
buffer: 47,
randombytes: 125
} ],
40: [ function(e, t, r) {
t.exports = e("./browser/algorithms.json");
}, {
"./browser/algorithms.json": 41
} ],
41: [ function(e, t, r) {
t.exports = {
sha224WithRSAEncryption: {
sign: "rsa",
hash: "sha224",
id: "302d300d06096086480165030402040500041c"
},
"RSA-SHA224": {
sign: "ecdsa/rsa",
hash: "sha224",
id: "302d300d06096086480165030402040500041c"
},
sha256WithRSAEncryption: {
sign: "rsa",
hash: "sha256",
id: "3031300d060960864801650304020105000420"
},
"RSA-SHA256": {
sign: "ecdsa/rsa",
hash: "sha256",
id: "3031300d060960864801650304020105000420"
},
sha384WithRSAEncryption: {
sign: "rsa",
hash: "sha384",
id: "3041300d060960864801650304020205000430"
},
"RSA-SHA384": {
sign: "ecdsa/rsa",
hash: "sha384",
id: "3041300d060960864801650304020205000430"
},
sha512WithRSAEncryption: {
sign: "rsa",
hash: "sha512",
id: "3051300d060960864801650304020305000440"
},
"RSA-SHA512": {
sign: "ecdsa/rsa",
hash: "sha512",
id: "3051300d060960864801650304020305000440"
},
"RSA-SHA1": {
sign: "rsa",
hash: "sha1",
id: "3021300906052b0e03021a05000414"
},
"ecdsa-with-SHA1": {
sign: "ecdsa",
hash: "sha1",
id: ""
},
sha256: {
sign: "ecdsa",
hash: "sha256",
id: ""
},
sha224: {
sign: "ecdsa",
hash: "sha224",
id: ""
},
sha384: {
sign: "ecdsa",
hash: "sha384",
id: ""
},
sha512: {
sign: "ecdsa",
hash: "sha512",
id: ""
},
"DSA-SHA": {
sign: "dsa",
hash: "sha1",
id: ""
},
"DSA-SHA1": {
sign: "dsa",
hash: "sha1",
id: ""
},
DSA: {
sign: "dsa",
hash: "sha1",
id: ""
},
"DSA-WITH-SHA224": {
sign: "dsa",
hash: "sha224",
id: ""
},
"DSA-SHA224": {
sign: "dsa",
hash: "sha224",
id: ""
},
"DSA-WITH-SHA256": {
sign: "dsa",
hash: "sha256",
id: ""
},
"DSA-SHA256": {
sign: "dsa",
hash: "sha256",
id: ""
},
"DSA-WITH-SHA384": {
sign: "dsa",
hash: "sha384",
id: ""
},
"DSA-SHA384": {
sign: "dsa",
hash: "sha384",
id: ""
},
"DSA-WITH-SHA512": {
sign: "dsa",
hash: "sha512",
id: ""
},
"DSA-SHA512": {
sign: "dsa",
hash: "sha512",
id: ""
},
"DSA-RIPEMD160": {
sign: "dsa",
hash: "rmd160",
id: ""
},
ripemd160WithRSA: {
sign: "rsa",
hash: "rmd160",
id: "3021300906052b2403020105000414"
},
"RSA-RIPEMD160": {
sign: "rsa",
hash: "rmd160",
id: "3021300906052b2403020105000414"
},
md5WithRSAEncryption: {
sign: "rsa",
hash: "md5",
id: "3020300c06082a864886f70d020505000410"
},
"RSA-MD5": {
sign: "rsa",
hash: "md5",
id: "3020300c06082a864886f70d020505000410"
}
};
}, {} ],
42: [ function(e, t, r) {
t.exports = {
"1.3.132.0.10": "secp256k1",
"1.3.132.0.33": "p224",
"1.2.840.10045.3.1.1": "p192",
"1.2.840.10045.3.1.7": "p256",
"1.3.132.0.34": "p384",
"1.3.132.0.35": "p521"
};
}, {} ],
43: [ function(e, t, r) {
(function(r) {
var i = e("create-hash"), n = e("stream"), a = e("inherits"), s = e("./sign"), f = e("./verify"), o = e("./algorithms.json");
Object.keys(o).forEach(function(e) {
o[e].id = new r(o[e].id, "hex");
o[e.toLowerCase()] = o[e];
});
function c(e) {
n.Writable.call(this);
var t = o[e];
if (!t) throw new Error("Unknown message digest");
this._hashType = t.hash;
this._hash = i(t.hash);
this._tag = t.id;
this._signType = t.sign;
}
a(c, n.Writable);
c.prototype._write = function(e, t, r) {
this._hash.update(e);
r();
};
c.prototype.update = function(e, t) {
"string" == typeof e && (e = new r(e, t));
this._hash.update(e);
return this;
};
c.prototype.sign = function(e, t) {
this.end();
var r = this._hash.digest(), i = s(r, e, this._hashType, this._signType, this._tag);
return t ? i.toString(t) : i;
};
function h(e) {
n.Writable.call(this);
var t = o[e];
if (!t) throw new Error("Unknown message digest");
this._hash = i(t.hash);
this._tag = t.id;
this._signType = t.sign;
}
a(h, n.Writable);
h.prototype._write = function(e, t, r) {
this._hash.update(e);
r();
};
h.prototype.update = function(e, t) {
"string" == typeof e && (e = new r(e, t));
this._hash.update(e);
return this;
};
h.prototype.verify = function(e, t, i) {
"string" == typeof t && (t = new r(t, i));
this.end();
var n = this._hash.digest();
return f(t, n, e, this._signType, this._tag);
};
function d(e) {
return new c(e);
}
function u(e) {
return new h(e);
}
t.exports = {
Sign: d,
Verify: u,
createSign: d,
createVerify: u
};
}).call(this, e("buffer").Buffer);
}, {
"./algorithms.json": 41,
"./sign": 44,
"./verify": 45,
buffer: 47,
"create-hash": 52,
inherits: 101,
stream: 152
} ],
44: [ function(e, t, r) {
(function(r) {
var i = e("create-hmac"), n = e("browserify-rsa"), a = e("elliptic").ec, s = e("bn.js"), f = e("parse-asn1"), o = e("./curves.json");
function c(e, t, n, a) {
if ((e = new r(e.toArray())).length < t.byteLength()) {
var s = new r(t.byteLength() - e.length);
s.fill(0);
e = r.concat([ s, e ]);
}
var f = n.length, o = function(e, t) {
e = (e = h(e, t)).mod(t);
var i = new r(e.toArray());
if (i.length < t.byteLength()) {
var n = new r(t.byteLength() - i.length);
n.fill(0);
i = r.concat([ n, i ]);
}
return i;
}(n, t), c = new r(f);
c.fill(1);
var d = new r(f);
d.fill(0);
d = i(a, d).update(c).update(new r([ 0 ])).update(e).update(o).digest();
c = i(a, d).update(c).digest();
return {
k: d = i(a, d).update(c).update(new r([ 1 ])).update(e).update(o).digest(),
v: c = i(a, d).update(c).digest()
};
}
function h(e, t) {
var r = new s(e), i = (e.length << 3) - t.bitLength();
i > 0 && r.ishrn(i);
return r;
}
function d(e, t, n) {
var a, s;
do {
a = new r(0);
for (;8 * a.length < e.bitLength(); ) {
t.v = i(n, t.k).update(t.v).digest();
a = r.concat([ a, t.v ]);
}
s = h(a, e);
t.k = i(n, t.k).update(t.v).update(new r([ 0 ])).digest();
t.v = i(n, t.k).update(t.v).digest();
} while (-1 !== s.cmp(e));
return s;
}
function u(e, t, r, i) {
return e.toRed(s.mont(r)).redPow(t).fromRed().mod(i);
}
t.exports = function(e, t, i, l, p) {
var b = f(t);
if (b.curve) {
if ("ecdsa" !== l && "ecdsa/rsa" !== l) throw new Error("wrong private key type");
return function(e, t) {
var i = o[t.curve.join(".")];
if (!i) throw new Error("unknown curve " + t.curve.join("."));
var n = new a(i).keyFromPrivate(t.privateKey).sign(e);
return new r(n.toDER());
}(e, b);
}
if ("dsa" === b.type) {
if ("dsa" !== l) throw new Error("wrong private key type");
return function(e, t, i) {
for (var n, a = t.params.priv_key, f = t.params.p, o = t.params.q, l = t.params.g, p = new s(0), b = h(e, o).mod(o), g = !1, m = c(a, o, e, i); !1 === g; ) {
n = d(o, m, i);
p = u(l, n, f, o);
if (0 === (g = n.invm(o).imul(b.add(a.mul(p))).mod(o)).cmpn(0)) {
g = !1;
p = new s(0);
}
}
return function(e, t) {
e = e.toArray();
t = t.toArray();
128 & e[0] && (e = [ 0 ].concat(e));
128 & t[0] && (t = [ 0 ].concat(t));
var i = [ 48, e.length + t.length + 4, 2, e.length ];
i = i.concat(e, [ 2, t.length ], t);
return new r(i);
}(p, g);
}(e, b, i);
}
if ("rsa" !== l && "ecdsa/rsa" !== l) throw new Error("wrong private key type");
e = r.concat([ p, e ]);
for (var g = b.modulus.byteLength(), m = [ 0, 1 ]; e.length + m.length + 1 < g; ) m.push(255);
m.push(0);
for (var y = -1; ++y < e.length; ) m.push(e[y]);
return n(m, b);
};
t.exports.getKey = c;
t.exports.makeKey = d;
}).call(this, e("buffer").Buffer);
}, {
"./curves.json": 42,
"bn.js": 16,
"browserify-rsa": 39,
buffer: 47,
"create-hmac": 54,
elliptic: 67,
"parse-asn1": 111
} ],
45: [ function(e, t, r) {
(function(r) {
var i = e("bn.js"), n = e("elliptic").ec, a = e("parse-asn1"), s = e("./curves.json");
function f(e, t) {
if (e.cmpn(0) <= 0) throw new Error("invalid sig");
if (e.cmp(t) >= t) throw new Error("invalid sig");
}
t.exports = function(e, t, o, c, h) {
var d = a(o);
if ("ec" === d.type) {
if ("ecdsa" !== c && "ecdsa/rsa" !== c) throw new Error("wrong public key type");
return function(e, t, r) {
var i = s[r.data.algorithm.curve.join(".")];
if (!i) throw new Error("unknown curve " + r.data.algorithm.curve.join("."));
var a = new n(i), f = r.data.subjectPrivateKey.data;
return a.verify(t, e, f);
}(e, t, d);
}
if ("dsa" === d.type) {
if ("dsa" !== c) throw new Error("wrong public key type");
return function(e, t, r) {
var n = r.data.p, s = r.data.q, o = r.data.g, c = r.data.pub_key, h = a.signature.decode(e, "der"), d = h.s, u = h.r;
f(d, s);
f(u, s);
var l = i.mont(n), p = d.invm(s);
return 0 === o.toRed(l).redPow(new i(t).mul(p).mod(s)).fromRed().mul(c.toRed(l).redPow(u.mul(p).mod(s)).fromRed()).mod(n).mod(s).cmp(u);
}(e, t, d);
}
if ("rsa" !== c && "ecdsa/rsa" !== c) throw new Error("wrong public key type");
t = r.concat([ h, t ]);
for (var u = d.modulus.byteLength(), l = [ 1 ], p = 0; t.length + l.length + 2 < u; ) {
l.push(255);
p++;
}
l.push(0);
for (var b = -1; ++b < t.length; ) l.push(t[b]);
l = new r(l);
var g = i.mont(d.modulus);
e = (e = new i(e).toRed(g)).redPow(new i(d.publicExponent));
e = new r(e.fromRed().toArray());
var m = p < 8 ? 1 : 0;
u = Math.min(e.length, l.length);
e.length !== l.length && (m = 1);
b = -1;
for (;++b < u; ) m |= e[b] ^ l[b];
return 0 === m;
};
}).call(this, e("buffer").Buffer);
}, {
"./curves.json": 42,
"bn.js": 16,
buffer: 47,
elliptic: 67,
"parse-asn1": 111
} ],
46: [ function(e, t, r) {
(function(e) {
t.exports = function(t, r) {
for (var i = Math.min(t.length, r.length), n = new e(i), a = 0; a < i; ++a) n[a] = t[a] ^ r[a];
return n;
};
}).call(this, e("buffer").Buffer);
}, {
buffer: 47
} ],
47: [ function(e, t, r) {
(function(t) {
"use strict";
var i = e("base64-js"), n = e("ieee754"), a = e("isarray");
r.Buffer = o;
r.SlowBuffer = function(e) {
+e != e && (e = 0);
return o.alloc(+e);
};
r.INSPECT_MAX_BYTES = 50;
o.TYPED_ARRAY_SUPPORT = void 0 !== t.TYPED_ARRAY_SUPPORT ? t.TYPED_ARRAY_SUPPORT : function() {
try {
var e = new Uint8Array(1);
e.__proto__ = {
__proto__: Uint8Array.prototype,
foo: function() {
return 42;
}
};
return 42 === e.foo() && "function" == typeof e.subarray && 0 === e.subarray(1, 1).byteLength;
} catch (e) {
return !1;
}
}();
r.kMaxLength = s();
function s() {
return o.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
}
function f(e, t) {
if (s() < t) throw new RangeError("Invalid typed array length");
if (o.TYPED_ARRAY_SUPPORT) (e = new Uint8Array(t)).__proto__ = o.prototype; else {
null === e && (e = new o(t));
e.length = t;
}
return e;
}
function o(e, t, r) {
if (!(o.TYPED_ARRAY_SUPPORT || this instanceof o)) return new o(e, t, r);
if ("number" == typeof e) {
if ("string" == typeof t) throw new Error("If encoding is specified then the first argument must be a string");
return d(this, e);
}
return c(this, e, t, r);
}
o.poolSize = 8192;
o._augment = function(e) {
e.__proto__ = o.prototype;
return e;
};
function c(e, t, r, i) {
if ("number" == typeof t) throw new TypeError('"value" argument must not be a number');
return "undefined" != typeof ArrayBuffer && t instanceof ArrayBuffer ? function(e, t, r, i) {
t.byteLength;
if (r < 0 || t.byteLength < r) throw new RangeError("'offset' is out of bounds");
if (t.byteLength < r + (i || 0)) throw new RangeError("'length' is out of bounds");
t = void 0 === r && void 0 === i ? new Uint8Array(t) : void 0 === i ? new Uint8Array(t, r) : new Uint8Array(t, r, i);
o.TYPED_ARRAY_SUPPORT ? (e = t).__proto__ = o.prototype : e = u(e, t);
return e;
}(e, t, r, i) : "string" == typeof t ? function(e, t, r) {
"string" == typeof r && "" !== r || (r = "utf8");
if (!o.isEncoding(r)) throw new TypeError('"encoding" must be a valid string encoding');
var i = 0 | p(t, r), n = (e = f(e, i)).write(t, r);
n !== i && (e = e.slice(0, n));
return e;
}(e, t, r) : function(e, t) {
if (o.isBuffer(t)) {
var r = 0 | l(t.length);
if (0 === (e = f(e, r)).length) return e;
t.copy(e, 0, 0, r);
return e;
}
if (t) {
if ("undefined" != typeof ArrayBuffer && t.buffer instanceof ArrayBuffer || "length" in t) return "number" != typeof t.length || function(e) {
return e != e;
}(t.length) ? f(e, 0) : u(e, t);
if ("Buffer" === t.type && a(t.data)) return u(e, t.data);
}
throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");
}(e, t);
}
o.from = function(e, t, r) {
return c(null, e, t, r);
};
if (o.TYPED_ARRAY_SUPPORT) {
o.prototype.__proto__ = Uint8Array.prototype;
o.__proto__ = Uint8Array;
"undefined" != typeof Symbol && Symbol.species && o[Symbol.species] === o && Object.defineProperty(o, Symbol.species, {
value: null,
configurable: !0
});
}
function h(e) {
if ("number" != typeof e) throw new TypeError('"size" argument must be a number');
if (e < 0) throw new RangeError('"size" argument must not be negative');
}
o.alloc = function(e, t, r) {
return function(e, t, r, i) {
h(t);
return t <= 0 ? f(e, t) : void 0 !== r ? "string" == typeof i ? f(e, t).fill(r, i) : f(e, t).fill(r) : f(e, t);
}(null, e, t, r);
};
function d(e, t) {
h(t);
e = f(e, t < 0 ? 0 : 0 | l(t));
if (!o.TYPED_ARRAY_SUPPORT) for (var r = 0; r < t; ++r) e[r] = 0;
return e;
}
o.allocUnsafe = function(e) {
return d(null, e);
};
o.allocUnsafeSlow = function(e) {
return d(null, e);
};
function u(e, t) {
var r = t.length < 0 ? 0 : 0 | l(t.length);
e = f(e, r);
for (var i = 0; i < r; i += 1) e[i] = 255 & t[i];
return e;
}
function l(e) {
if (e >= s()) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + s().toString(16) + " bytes");
return 0 | e;
}
o.isBuffer = function(e) {
return !(null == e || !e._isBuffer);
};
o.compare = function(e, t) {
if (!o.isBuffer(e) || !o.isBuffer(t)) throw new TypeError("Arguments must be Buffers");
if (e === t) return 0;
for (var r = e.length, i = t.length, n = 0, a = Math.min(r, i); n < a; ++n) if (e[n] !== t[n]) {
r = e[n];
i = t[n];
break;
}
return r < i ? -1 : i < r ? 1 : 0;
};
o.isEncoding = function(e) {
switch (String(e).toLowerCase()) {
case "hex":
case "utf8":
case "utf-8":
case "ascii":
case "latin1":
case "binary":
case "base64":
case "ucs2":
case "ucs-2":
case "utf16le":
case "utf-16le":
return !0;

default:
return !1;
}
};
o.concat = function(e, t) {
if (!a(e)) throw new TypeError('"list" argument must be an Array of Buffers');
if (0 === e.length) return o.alloc(0);
var r;
if (void 0 === t) {
t = 0;
for (r = 0; r < e.length; ++r) t += e[r].length;
}
var i = o.allocUnsafe(t), n = 0;
for (r = 0; r < e.length; ++r) {
var s = e[r];
if (!o.isBuffer(s)) throw new TypeError('"list" argument must be an Array of Buffers');
s.copy(i, n);
n += s.length;
}
return i;
};
function p(e, t) {
if (o.isBuffer(e)) return e.length;
if ("undefined" != typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && (ArrayBuffer.isView(e) || e instanceof ArrayBuffer)) return e.byteLength;
"string" != typeof e && (e = "" + e);
var r = e.length;
if (0 === r) return 0;
for (var i = !1; ;) switch (t) {
case "ascii":
case "latin1":
case "binary":
return r;

case "utf8":
case "utf-8":
case void 0:
return z(e).length;

case "ucs2":
case "ucs-2":
case "utf16le":
case "utf-16le":
return 2 * r;

case "hex":
return r >>> 1;

case "base64":
return q(e).length;

default:
if (i) return z(e).length;
t = ("" + t).toLowerCase();
i = !0;
}
}
o.byteLength = p;
o.prototype._isBuffer = !0;
function b(e, t, r) {
var i = e[t];
e[t] = e[r];
e[r] = i;
}
o.prototype.swap16 = function() {
var e = this.length;
if (e % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
for (var t = 0; t < e; t += 2) b(this, t, t + 1);
return this;
};
o.prototype.swap32 = function() {
var e = this.length;
if (e % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
for (var t = 0; t < e; t += 4) {
b(this, t, t + 3);
b(this, t + 1, t + 2);
}
return this;
};
o.prototype.swap64 = function() {
var e = this.length;
if (e % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
for (var t = 0; t < e; t += 8) {
b(this, t, t + 7);
b(this, t + 1, t + 6);
b(this, t + 2, t + 5);
b(this, t + 3, t + 4);
}
return this;
};
o.prototype.toString = function() {
var e = 0 | this.length;
return 0 === e ? "" : 0 === arguments.length ? k(this, 0, e) : function(e, t, r) {
var i = !1;
(void 0 === t || t < 0) && (t = 0);
if (t > this.length) return "";
(void 0 === r || r > this.length) && (r = this.length);
if (r <= 0) return "";
if ((r >>>= 0) <= (t >>>= 0)) return "";
e || (e = "utf8");
for (;;) switch (e) {
case "hex":
return R(this, t, r);

case "utf8":
case "utf-8":
return k(this, t, r);

case "ascii":
return x(this, t, r);

case "latin1":
case "binary":
return I(this, t, r);

case "base64":
return M(this, t, r);

case "ucs2":
case "ucs-2":
case "utf16le":
case "utf-16le":
return B(this, t, r);

default:
if (i) throw new TypeError("Unknown encoding: " + e);
e = (e + "").toLowerCase();
i = !0;
}
}.apply(this, arguments);
};
o.prototype.equals = function(e) {
if (!o.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
return this === e || 0 === o.compare(this, e);
};
o.prototype.inspect = function() {
var e = "", t = r.INSPECT_MAX_BYTES;
if (this.length > 0) {
e = this.toString("hex", 0, t).match(/.{2}/g).join(" ");
this.length > t && (e += " ... ");
}
return "<Buffer " + e + ">";
};
o.prototype.compare = function(e, t, r, i, n) {
if (!o.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
void 0 === t && (t = 0);
void 0 === r && (r = e ? e.length : 0);
void 0 === i && (i = 0);
void 0 === n && (n = this.length);
if (t < 0 || r > e.length || i < 0 || n > this.length) throw new RangeError("out of range index");
if (i >= n && t >= r) return 0;
if (i >= n) return -1;
if (t >= r) return 1;
t >>>= 0;
r >>>= 0;
i >>>= 0;
n >>>= 0;
if (this === e) return 0;
for (var a = n - i, s = r - t, f = Math.min(a, s), c = this.slice(i, n), h = e.slice(t, r), d = 0; d < f; ++d) if (c[d] !== h[d]) {
a = c[d];
s = h[d];
break;
}
return a < s ? -1 : s < a ? 1 : 0;
};
function g(e, t, r, i, n) {
if (0 === e.length) return -1;
if ("string" == typeof r) {
i = r;
r = 0;
} else r > 2147483647 ? r = 2147483647 : r < -2147483648 && (r = -2147483648);
r = +r;
isNaN(r) && (r = n ? 0 : e.length - 1);
r < 0 && (r = e.length + r);
if (r >= e.length) {
if (n) return -1;
r = e.length - 1;
} else if (r < 0) {
if (!n) return -1;
r = 0;
}
"string" == typeof t && (t = o.from(t, i));
if (o.isBuffer(t)) return 0 === t.length ? -1 : m(e, t, r, i, n);
if ("number" == typeof t) {
t &= 255;
return o.TYPED_ARRAY_SUPPORT && "function" == typeof Uint8Array.prototype.indexOf ? n ? Uint8Array.prototype.indexOf.call(e, t, r) : Uint8Array.prototype.lastIndexOf.call(e, t, r) : m(e, [ t ], r, i, n);
}
throw new TypeError("val must be string, number or Buffer");
}
function m(e, t, r, i, n) {
var a, s = 1, f = e.length, o = t.length;
if (void 0 !== i && ("ucs2" === (i = String(i).toLowerCase()) || "ucs-2" === i || "utf16le" === i || "utf-16le" === i)) {
if (e.length < 2 || t.length < 2) return -1;
s = 2;
f /= 2;
o /= 2;
r /= 2;
}
function c(e, t) {
return 1 === s ? e[t] : e.readUInt16BE(t * s);
}
if (n) {
var h = -1;
for (a = r; a < f; a++) if (c(e, a) === c(t, -1 === h ? 0 : a - h)) {
-1 === h && (h = a);
if (a - h + 1 === o) return h * s;
} else {
-1 !== h && (a -= a - h);
h = -1;
}
} else {
r + o > f && (r = f - o);
for (a = r; a >= 0; a--) {
for (var d = !0, u = 0; u < o; u++) if (c(e, a + u) !== c(t, u)) {
d = !1;
break;
}
if (d) return a;
}
}
return -1;
}
o.prototype.includes = function(e, t, r) {
return -1 !== this.indexOf(e, t, r);
};
o.prototype.indexOf = function(e, t, r) {
return g(this, e, t, r, !0);
};
o.prototype.lastIndexOf = function(e, t, r) {
return g(this, e, t, r, !1);
};
function y(e, t, r, i) {
r = Number(r) || 0;
var n = e.length - r;
i ? (i = Number(i)) > n && (i = n) : i = n;
var a = t.length;
if (a % 2 != 0) throw new TypeError("Invalid hex string");
i > a / 2 && (i = a / 2);
for (var s = 0; s < i; ++s) {
var f = parseInt(t.substr(2 * s, 2), 16);
if (isNaN(f)) return s;
e[r + s] = f;
}
return s;
}
function v(e, t, r, i) {
return F(z(t, e.length - r), e, r, i);
}
function _(e, t, r, i) {
return F(function(e) {
for (var t = [], r = 0; r < e.length; ++r) t.push(255 & e.charCodeAt(r));
return t;
}(t), e, r, i);
}
function w(e, t, r, i) {
return _(e, t, r, i);
}
function S(e, t, r, i) {
return F(q(t), e, r, i);
}
function E(e, t, r, i) {
return F(function(e, t) {
for (var r, i, n, a = [], s = 0; s < e.length && !((t -= 2) < 0); ++s) {
r = e.charCodeAt(s);
i = r >> 8;
n = r % 256;
a.push(n);
a.push(i);
}
return a;
}(t, e.length - r), e, r, i);
}
o.prototype.write = function(e, t, r, i) {
if (void 0 === t) {
i = "utf8";
r = this.length;
t = 0;
} else if (void 0 === r && "string" == typeof t) {
i = t;
r = this.length;
t = 0;
} else {
if (!isFinite(t)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
t |= 0;
if (isFinite(r)) {
r |= 0;
void 0 === i && (i = "utf8");
} else {
i = r;
r = void 0;
}
}
var n = this.length - t;
(void 0 === r || r > n) && (r = n);
if (e.length > 0 && (r < 0 || t < 0) || t > this.length) throw new RangeError("Attempt to write outside buffer bounds");
i || (i = "utf8");
for (var a = !1; ;) switch (i) {
case "hex":
return y(this, e, t, r);

case "utf8":
case "utf-8":
return v(this, e, t, r);

case "ascii":
return _(this, e, t, r);

case "latin1":
case "binary":
return w(this, e, t, r);

case "base64":
return S(this, e, t, r);

case "ucs2":
case "ucs-2":
case "utf16le":
case "utf-16le":
return E(this, e, t, r);

default:
if (a) throw new TypeError("Unknown encoding: " + i);
i = ("" + i).toLowerCase();
a = !0;
}
};
o.prototype.toJSON = function() {
return {
type: "Buffer",
data: Array.prototype.slice.call(this._arr || this, 0)
};
};
function M(e, t, r) {
return 0 === t && r === e.length ? i.fromByteArray(e) : i.fromByteArray(e.slice(t, r));
}
function k(e, t, r) {
r = Math.min(e.length, r);
for (var i = [], n = t; n < r; ) {
var a = e[n], s = null, f = a > 239 ? 4 : a > 223 ? 3 : a > 191 ? 2 : 1;
if (n + f <= r) {
var o, c, h, d;
switch (f) {
case 1:
a < 128 && (s = a);
break;

case 2:
128 == (192 & (o = e[n + 1])) && (d = (31 & a) << 6 | 63 & o) > 127 && (s = d);
break;

case 3:
o = e[n + 1];
c = e[n + 2];
128 == (192 & o) && 128 == (192 & c) && (d = (15 & a) << 12 | (63 & o) << 6 | 63 & c) > 2047 && (d < 55296 || d > 57343) && (s = d);
break;

case 4:
o = e[n + 1];
c = e[n + 2];
h = e[n + 3];
128 == (192 & o) && 128 == (192 & c) && 128 == (192 & h) && (d = (15 & a) << 18 | (63 & o) << 12 | (63 & c) << 6 | 63 & h) > 65535 && d < 1114112 && (s = d);
}
}
if (null === s) {
s = 65533;
f = 1;
} else if (s > 65535) {
s -= 65536;
i.push(s >>> 10 & 1023 | 55296);
s = 56320 | 1023 & s;
}
i.push(s);
n += f;
}
return function(e) {
var t = e.length;
if (t <= A) return String.fromCharCode.apply(String, e);
var r = "", i = 0;
for (;i < t; ) r += String.fromCharCode.apply(String, e.slice(i, i += A));
return r;
}(i);
}
var A = 4096;
function x(e, t, r) {
var i = "";
r = Math.min(e.length, r);
for (var n = t; n < r; ++n) i += String.fromCharCode(127 & e[n]);
return i;
}
function I(e, t, r) {
var i = "";
r = Math.min(e.length, r);
for (var n = t; n < r; ++n) i += String.fromCharCode(e[n]);
return i;
}
function R(e, t, r) {
var i = e.length;
(!t || t < 0) && (t = 0);
(!r || r < 0 || r > i) && (r = i);
for (var n = "", a = t; a < r; ++a) n += L(e[a]);
return n;
}
function B(e, t, r) {
for (var i = e.slice(t, r), n = "", a = 0; a < i.length; a += 2) n += String.fromCharCode(i[a] + 256 * i[a + 1]);
return n;
}
o.prototype.slice = function(e, t) {
var r, i = this.length;
e = ~~e;
t = void 0 === t ? i : ~~t;
e < 0 ? (e += i) < 0 && (e = 0) : e > i && (e = i);
t < 0 ? (t += i) < 0 && (t = 0) : t > i && (t = i);
t < e && (t = e);
if (o.TYPED_ARRAY_SUPPORT) (r = this.subarray(e, t)).__proto__ = o.prototype; else {
var n = t - e;
r = new o(n, void 0);
for (var a = 0; a < n; ++a) r[a] = this[a + e];
}
return r;
};
function C(e, t, r) {
if (e % 1 != 0 || e < 0) throw new RangeError("offset is not uint");
if (e + t > r) throw new RangeError("Trying to access beyond buffer length");
}
o.prototype.readUIntLE = function(e, t, r) {
e |= 0;
t |= 0;
r || C(e, t, this.length);
for (var i = this[e], n = 1, a = 0; ++a < t && (n *= 256); ) i += this[e + a] * n;
return i;
};
o.prototype.readUIntBE = function(e, t, r) {
e |= 0;
t |= 0;
r || C(e, t, this.length);
for (var i = this[e + --t], n = 1; t > 0 && (n *= 256); ) i += this[e + --t] * n;
return i;
};
o.prototype.readUInt8 = function(e, t) {
t || C(e, 1, this.length);
return this[e];
};
o.prototype.readUInt16LE = function(e, t) {
t || C(e, 2, this.length);
return this[e] | this[e + 1] << 8;
};
o.prototype.readUInt16BE = function(e, t) {
t || C(e, 2, this.length);
return this[e] << 8 | this[e + 1];
};
o.prototype.readUInt32LE = function(e, t) {
t || C(e, 4, this.length);
return (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 16777216 * this[e + 3];
};
o.prototype.readUInt32BE = function(e, t) {
t || C(e, 4, this.length);
return 16777216 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]);
};
o.prototype.readIntLE = function(e, t, r) {
e |= 0;
t |= 0;
r || C(e, t, this.length);
for (var i = this[e], n = 1, a = 0; ++a < t && (n *= 256); ) i += this[e + a] * n;
i >= (n *= 128) && (i -= Math.pow(2, 8 * t));
return i;
};
o.prototype.readIntBE = function(e, t, r) {
e |= 0;
t |= 0;
r || C(e, t, this.length);
for (var i = t, n = 1, a = this[e + --i]; i > 0 && (n *= 256); ) a += this[e + --i] * n;
a >= (n *= 128) && (a -= Math.pow(2, 8 * t));
return a;
};
o.prototype.readInt8 = function(e, t) {
t || C(e, 1, this.length);
return 128 & this[e] ? -1 * (255 - this[e] + 1) : this[e];
};
o.prototype.readInt16LE = function(e, t) {
t || C(e, 2, this.length);
var r = this[e] | this[e + 1] << 8;
return 32768 & r ? 4294901760 | r : r;
};
o.prototype.readInt16BE = function(e, t) {
t || C(e, 2, this.length);
var r = this[e + 1] | this[e] << 8;
return 32768 & r ? 4294901760 | r : r;
};
o.prototype.readInt32LE = function(e, t) {
t || C(e, 4, this.length);
return this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24;
};
o.prototype.readInt32BE = function(e, t) {
t || C(e, 4, this.length);
return this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3];
};
o.prototype.readFloatLE = function(e, t) {
t || C(e, 4, this.length);
return n.read(this, e, !0, 23, 4);
};
o.prototype.readFloatBE = function(e, t) {
t || C(e, 4, this.length);
return n.read(this, e, !1, 23, 4);
};
o.prototype.readDoubleLE = function(e, t) {
t || C(e, 8, this.length);
return n.read(this, e, !0, 52, 8);
};
o.prototype.readDoubleBE = function(e, t) {
t || C(e, 8, this.length);
return n.read(this, e, !1, 52, 8);
};
function j(e, t, r, i, n, a) {
if (!o.isBuffer(e)) throw new TypeError('"buffer" argument must be a Buffer instance');
if (t > n || t < a) throw new RangeError('"value" argument is out of bounds');
if (r + i > e.length) throw new RangeError("Index out of range");
}
o.prototype.writeUIntLE = function(e, t, r, i) {
e = +e;
t |= 0;
r |= 0;
if (!i) {
j(this, e, t, r, Math.pow(2, 8 * r) - 1, 0);
}
var n = 1, a = 0;
this[t] = 255 & e;
for (;++a < r && (n *= 256); ) this[t + a] = e / n & 255;
return t + r;
};
o.prototype.writeUIntBE = function(e, t, r, i) {
e = +e;
t |= 0;
r |= 0;
if (!i) {
j(this, e, t, r, Math.pow(2, 8 * r) - 1, 0);
}
var n = r - 1, a = 1;
this[t + n] = 255 & e;
for (;--n >= 0 && (a *= 256); ) this[t + n] = e / a & 255;
return t + r;
};
o.prototype.writeUInt8 = function(e, t, r) {
e = +e;
t |= 0;
r || j(this, e, t, 1, 255, 0);
o.TYPED_ARRAY_SUPPORT || (e = Math.floor(e));
this[t] = 255 & e;
return t + 1;
};
function P(e, t, r, i) {
t < 0 && (t = 65535 + t + 1);
for (var n = 0, a = Math.min(e.length - r, 2); n < a; ++n) e[r + n] = (t & 255 << 8 * (i ? n : 1 - n)) >>> 8 * (i ? n : 1 - n);
}
o.prototype.writeUInt16LE = function(e, t, r) {
e = +e;
t |= 0;
r || j(this, e, t, 2, 65535, 0);
if (o.TYPED_ARRAY_SUPPORT) {
this[t] = 255 & e;
this[t + 1] = e >>> 8;
} else P(this, e, t, !0);
return t + 2;
};
o.prototype.writeUInt16BE = function(e, t, r) {
e = +e;
t |= 0;
r || j(this, e, t, 2, 65535, 0);
if (o.TYPED_ARRAY_SUPPORT) {
this[t] = e >>> 8;
this[t + 1] = 255 & e;
} else P(this, e, t, !1);
return t + 2;
};
function T(e, t, r, i) {
t < 0 && (t = 4294967295 + t + 1);
for (var n = 0, a = Math.min(e.length - r, 4); n < a; ++n) e[r + n] = t >>> 8 * (i ? n : 3 - n) & 255;
}
o.prototype.writeUInt32LE = function(e, t, r) {
e = +e;
t |= 0;
r || j(this, e, t, 4, 4294967295, 0);
if (o.TYPED_ARRAY_SUPPORT) {
this[t + 3] = e >>> 24;
this[t + 2] = e >>> 16;
this[t + 1] = e >>> 8;
this[t] = 255 & e;
} else T(this, e, t, !0);
return t + 4;
};
o.prototype.writeUInt32BE = function(e, t, r) {
e = +e;
t |= 0;
r || j(this, e, t, 4, 4294967295, 0);
if (o.TYPED_ARRAY_SUPPORT) {
this[t] = e >>> 24;
this[t + 1] = e >>> 16;
this[t + 2] = e >>> 8;
this[t + 3] = 255 & e;
} else T(this, e, t, !1);
return t + 4;
};
o.prototype.writeIntLE = function(e, t, r, i) {
e = +e;
t |= 0;
if (!i) {
var n = Math.pow(2, 8 * r - 1);
j(this, e, t, r, n - 1, -n);
}
var a = 0, s = 1, f = 0;
this[t] = 255 & e;
for (;++a < r && (s *= 256); ) {
e < 0 && 0 === f && 0 !== this[t + a - 1] && (f = 1);
this[t + a] = (e / s >> 0) - f & 255;
}
return t + r;
};
o.prototype.writeIntBE = function(e, t, r, i) {
e = +e;
t |= 0;
if (!i) {
var n = Math.pow(2, 8 * r - 1);
j(this, e, t, r, n - 1, -n);
}
var a = r - 1, s = 1, f = 0;
this[t + a] = 255 & e;
for (;--a >= 0 && (s *= 256); ) {
e < 0 && 0 === f && 0 !== this[t + a + 1] && (f = 1);
this[t + a] = (e / s >> 0) - f & 255;
}
return t + r;
};
o.prototype.writeInt8 = function(e, t, r) {
e = +e;
t |= 0;
r || j(this, e, t, 1, 127, -128);
o.TYPED_ARRAY_SUPPORT || (e = Math.floor(e));
e < 0 && (e = 255 + e + 1);
this[t] = 255 & e;
return t + 1;
};
o.prototype.writeInt16LE = function(e, t, r) {
e = +e;
t |= 0;
r || j(this, e, t, 2, 32767, -32768);
if (o.TYPED_ARRAY_SUPPORT) {
this[t] = 255 & e;
this[t + 1] = e >>> 8;
} else P(this, e, t, !0);
return t + 2;
};
o.prototype.writeInt16BE = function(e, t, r) {
e = +e;
t |= 0;
r || j(this, e, t, 2, 32767, -32768);
if (o.TYPED_ARRAY_SUPPORT) {
this[t] = e >>> 8;
this[t + 1] = 255 & e;
} else P(this, e, t, !1);
return t + 2;
};
o.prototype.writeInt32LE = function(e, t, r) {
e = +e;
t |= 0;
r || j(this, e, t, 4, 2147483647, -2147483648);
if (o.TYPED_ARRAY_SUPPORT) {
this[t] = 255 & e;
this[t + 1] = e >>> 8;
this[t + 2] = e >>> 16;
this[t + 3] = e >>> 24;
} else T(this, e, t, !0);
return t + 4;
};
o.prototype.writeInt32BE = function(e, t, r) {
e = +e;
t |= 0;
r || j(this, e, t, 4, 2147483647, -2147483648);
e < 0 && (e = 4294967295 + e + 1);
if (o.TYPED_ARRAY_SUPPORT) {
this[t] = e >>> 24;
this[t + 1] = e >>> 16;
this[t + 2] = e >>> 8;
this[t + 3] = 255 & e;
} else T(this, e, t, !1);
return t + 4;
};
function U(e, t, r, i, n, a) {
if (r + i > e.length) throw new RangeError("Index out of range");
if (r < 0) throw new RangeError("Index out of range");
}
function D(e, t, r, i, a) {
a || U(e, 0, r, 4);
n.write(e, t, r, i, 23, 4);
return r + 4;
}
o.prototype.writeFloatLE = function(e, t, r) {
return D(this, e, t, !0, r);
};
o.prototype.writeFloatBE = function(e, t, r) {
return D(this, e, t, !1, r);
};
function N(e, t, r, i, a) {
a || U(e, 0, r, 8);
n.write(e, t, r, i, 52, 8);
return r + 8;
}
o.prototype.writeDoubleLE = function(e, t, r) {
return N(this, e, t, !0, r);
};
o.prototype.writeDoubleBE = function(e, t, r) {
return N(this, e, t, !1, r);
};
o.prototype.copy = function(e, t, r, i) {
r || (r = 0);
i || 0 === i || (i = this.length);
t >= e.length && (t = e.length);
t || (t = 0);
i > 0 && i < r && (i = r);
if (i === r) return 0;
if (0 === e.length || 0 === this.length) return 0;
if (t < 0) throw new RangeError("targetStart out of bounds");
if (r < 0 || r >= this.length) throw new RangeError("sourceStart out of bounds");
if (i < 0) throw new RangeError("sourceEnd out of bounds");
i > this.length && (i = this.length);
e.length - t < i - r && (i = e.length - t + r);
var n, a = i - r;
if (this === e && r < t && t < i) for (n = a - 1; n >= 0; --n) e[n + t] = this[n + r]; else if (a < 1e3 || !o.TYPED_ARRAY_SUPPORT) for (n = 0; n < a; ++n) e[n + t] = this[n + r]; else Uint8Array.prototype.set.call(e, this.subarray(r, r + a), t);
return a;
};
o.prototype.fill = function(e, t, r, i) {
if ("string" == typeof e) {
if ("string" == typeof t) {
i = t;
t = 0;
r = this.length;
} else if ("string" == typeof r) {
i = r;
r = this.length;
}
if (1 === e.length) {
var n = e.charCodeAt(0);
n < 256 && (e = n);
}
if (void 0 !== i && "string" != typeof i) throw new TypeError("encoding must be a string");
if ("string" == typeof i && !o.isEncoding(i)) throw new TypeError("Unknown encoding: " + i);
} else "number" == typeof e && (e &= 255);
if (t < 0 || this.length < t || this.length < r) throw new RangeError("Out of range index");
if (r <= t) return this;
t >>>= 0;
r = void 0 === r ? this.length : r >>> 0;
e || (e = 0);
var a;
if ("number" == typeof e) for (a = t; a < r; ++a) this[a] = e; else {
var s = o.isBuffer(e) ? e : z(new o(e, i).toString()), f = s.length;
for (a = 0; a < r - t; ++a) this[a + t] = s[a % f];
}
return this;
};
var O = /[^+\/0-9A-Za-z-_]/g;
function L(e) {
return e < 16 ? "0" + e.toString(16) : e.toString(16);
}
function z(e, t) {
t = t || Infinity;
for (var r, i = e.length, n = null, a = [], s = 0; s < i; ++s) {
if ((r = e.charCodeAt(s)) > 55295 && r < 57344) {
if (!n) {
if (r > 56319) {
(t -= 3) > -1 && a.push(239, 191, 189);
continue;
}
if (s + 1 === i) {
(t -= 3) > -1 && a.push(239, 191, 189);
continue;
}
n = r;
continue;
}
if (r < 56320) {
(t -= 3) > -1 && a.push(239, 191, 189);
n = r;
continue;
}
r = 65536 + (n - 55296 << 10 | r - 56320);
} else n && (t -= 3) > -1 && a.push(239, 191, 189);
n = null;
if (r < 128) {
if ((t -= 1) < 0) break;
a.push(r);
} else if (r < 2048) {
if ((t -= 2) < 0) break;
a.push(r >> 6 | 192, 63 & r | 128);
} else if (r < 65536) {
if ((t -= 3) < 0) break;
a.push(r >> 12 | 224, r >> 6 & 63 | 128, 63 & r | 128);
} else {
if (!(r < 1114112)) throw new Error("Invalid code point");
if ((t -= 4) < 0) break;
a.push(r >> 18 | 240, r >> 12 & 63 | 128, r >> 6 & 63 | 128, 63 & r | 128);
}
}
return a;
}
function q(e) {
return i.toByteArray(function(e) {
if ((e = function(e) {
return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "");
}(e).replace(O, "")).length < 2) return "";
for (;e.length % 4 != 0; ) e += "=";
return e;
}(e));
}
function F(e, t, r, i) {
for (var n = 0; n < i && !(n + r >= t.length || n >= e.length); ++n) t[n + r] = e[n];
return n;
}
}).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
}, {
"base64-js": 15,
ieee754: 99,
isarray: 48
} ],
48: [ function(e, t, r) {
var i = {}.toString;
t.exports = Array.isArray || function(e) {
return "[object Array]" == i.call(e);
};
}, {} ],
49: [ function(e, t, r) {
var i = e("safe-buffer").Buffer, n = e("stream").Transform, a = e("string_decoder").StringDecoder;
function s(e) {
n.call(this);
this.hashMode = "string" == typeof e;
this.hashMode ? this[e] = this._finalOrDigest : this.final = this._finalOrDigest;
if (this._final) {
this.__final = this._final;
this._final = null;
}
this._decoder = null;
this._encoding = null;
}
e("inherits")(s, n);
s.prototype.update = function(e, t, r) {
"string" == typeof e && (e = i.from(e, t));
var n = this._update(e);
if (this.hashMode) return this;
r && (n = this._toString(n, r));
return n;
};
s.prototype.setAutoPadding = function() {};
s.prototype.getAuthTag = function() {
throw new Error("trying to get auth tag in unsupported state");
};
s.prototype.setAuthTag = function() {
throw new Error("trying to set auth tag in unsupported state");
};
s.prototype.setAAD = function() {
throw new Error("trying to set aad in unsupported state");
};
s.prototype._transform = function(e, t, r) {
var i;
try {
this.hashMode ? this._update(e) : this.push(this._update(e));
} catch (e) {
i = e;
} finally {
r(i);
}
};
s.prototype._flush = function(e) {
var t;
try {
this.push(this.__final());
} catch (e) {
t = e;
}
e(t);
};
s.prototype._finalOrDigest = function(e) {
var t = this.__final() || i.alloc(0);
e && (t = this._toString(t, e, !0));
return t;
};
s.prototype._toString = function(e, t, r) {
if (!this._decoder) {
this._decoder = new a(t);
this._encoding = t;
}
if (this._encoding !== t) throw new Error("can't switch encodings");
var i = this._decoder.write(e);
r && (i += this._decoder.end());
return i;
};
t.exports = s;
}, {
inherits: 101,
"safe-buffer": 143,
stream: 152,
string_decoder: 153
} ],
50: [ function(e, t, r) {
(function(e) {
r.isArray = function(e) {
return Array.isArray ? Array.isArray(e) : "[object Array]" === t(e);
};
r.isBoolean = function(e) {
return "boolean" == typeof e;
};
r.isNull = function(e) {
return null === e;
};
r.isNullOrUndefined = function(e) {
return null == e;
};
r.isNumber = function(e) {
return "number" == typeof e;
};
r.isString = function(e) {
return "string" == typeof e;
};
r.isSymbol = function(e) {
return "symbol" == typeof e;
};
r.isUndefined = function(e) {
return void 0 === e;
};
r.isRegExp = function(e) {
return "[object RegExp]" === t(e);
};
r.isObject = function(e) {
return "object" == typeof e && null !== e;
};
r.isDate = function(e) {
return "[object Date]" === t(e);
};
r.isError = function(e) {
return "[object Error]" === t(e) || e instanceof Error;
};
r.isFunction = function(e) {
return "function" == typeof e;
};
r.isPrimitive = function(e) {
return null === e || "boolean" == typeof e || "number" == typeof e || "string" == typeof e || "symbol" == typeof e || "undefined" == typeof e;
};
r.isBuffer = e.isBuffer;
function t(e) {
return Object.prototype.toString.call(e);
}
}).call(this, {
isBuffer: e("../../is-buffer/index.js")
});
}, {
"../../is-buffer/index.js": 102
} ],
51: [ function(e, t, r) {
(function(r) {
var i = e("elliptic"), n = e("bn.js");
t.exports = function(e) {
return new s(e);
};
var a = {
secp256k1: {
name: "secp256k1",
byteLength: 32
},
secp224r1: {
name: "p224",
byteLength: 28
},
prime256v1: {
name: "p256",
byteLength: 32
},
prime192v1: {
name: "p192",
byteLength: 24
},
ed25519: {
name: "ed25519",
byteLength: 32
},
secp384r1: {
name: "p384",
byteLength: 48
},
secp521r1: {
name: "p521",
byteLength: 66
}
};
a.p224 = a.secp224r1;
a.p256 = a.secp256r1 = a.prime256v1;
a.p192 = a.secp192r1 = a.prime192v1;
a.p384 = a.secp384r1;
a.p521 = a.secp521r1;
function s(e) {
this.curveType = a[e];
this.curveType || (this.curveType = {
name: e
});
this.curve = new i.ec(this.curveType.name);
this.keys = void 0;
}
s.prototype.generateKeys = function(e, t) {
this.keys = this.curve.genKeyPair();
return this.getPublicKey(e, t);
};
s.prototype.computeSecret = function(e, t, i) {
t = t || "utf8";
r.isBuffer(e) || (e = new r(e, t));
return f(this.curve.keyFromPublic(e).getPublic().mul(this.keys.getPrivate()).getX(), i, this.curveType.byteLength);
};
s.prototype.getPublicKey = function(e, t) {
var r = this.keys.getPublic("compressed" === t, !0);
"hybrid" === t && (r[r.length - 1] % 2 ? r[0] = 7 : r[0] = 6);
return f(r, e);
};
s.prototype.getPrivateKey = function(e) {
return f(this.keys.getPrivate(), e);
};
s.prototype.setPublicKey = function(e, t) {
t = t || "utf8";
r.isBuffer(e) || (e = new r(e, t));
this.keys._importPublic(e);
return this;
};
s.prototype.setPrivateKey = function(e, t) {
t = t || "utf8";
r.isBuffer(e) || (e = new r(e, t));
var i = new n(e);
i = i.toString(16);
this.keys = this.curve.genKeyPair();
this.keys._importPrivate(i);
return this;
};
function f(e, t, i) {
Array.isArray(e) || (e = e.toArray());
var n = new r(e);
if (i && n.length < i) {
var a = new r(i - n.length);
a.fill(0);
n = r.concat([ a, n ]);
}
return t ? n.toString(t) : n;
}
}).call(this, e("buffer").Buffer);
}, {
"bn.js": 16,
buffer: 47,
elliptic: 67
} ],
52: [ function(e, t, r) {
"use strict";
var i = e("inherits"), n = e("md5.js"), a = e("ripemd160"), s = e("sha.js"), f = e("cipher-base");
function o(e) {
f.call(this, "digest");
this._hash = e;
}
i(o, f);
o.prototype._update = function(e) {
this._hash.update(e);
};
o.prototype._final = function() {
return this._hash.digest();
};
t.exports = function(e) {
return "md5" === (e = e.toLowerCase()) ? new n() : "rmd160" === e || "ripemd160" === e ? new a() : new o(s(e));
};
}, {
"cipher-base": 49,
inherits: 101,
"md5.js": 103,
ripemd160: 142,
"sha.js": 145
} ],
53: [ function(e, t, r) {
var i = e("md5.js");
t.exports = function(e) {
return new i().update(e).digest();
};
}, {
"md5.js": 103
} ],
54: [ function(e, t, r) {
"use strict";
var i = e("inherits"), n = e("./legacy"), a = e("cipher-base"), s = e("safe-buffer").Buffer, f = e("create-hash/md5"), o = e("ripemd160"), c = e("sha.js"), h = s.alloc(128);
function d(e, t) {
a.call(this, "digest");
"string" == typeof t && (t = s.from(t));
var r = "sha512" === e || "sha384" === e ? 128 : 64;
this._alg = e;
this._key = t;
if (t.length > r) {
t = ("rmd160" === e ? new o() : c(e)).update(t).digest();
} else t.length < r && (t = s.concat([ t, h ], r));
for (var i = this._ipad = s.allocUnsafe(r), n = this._opad = s.allocUnsafe(r), f = 0; f < r; f++) {
i[f] = 54 ^ t[f];
n[f] = 92 ^ t[f];
}
this._hash = "rmd160" === e ? new o() : c(e);
this._hash.update(i);
}
i(d, a);
d.prototype._update = function(e) {
this._hash.update(e);
};
d.prototype._final = function() {
var e = this._hash.digest();
return ("rmd160" === this._alg ? new o() : c(this._alg)).update(this._opad).update(e).digest();
};
t.exports = function(e, t) {
return "rmd160" === (e = e.toLowerCase()) || "ripemd160" === e ? new d("rmd160", t) : "md5" === e ? new n(f, t) : new d(e, t);
};
}, {
"./legacy": 55,
"cipher-base": 49,
"create-hash/md5": 53,
inherits: 101,
ripemd160: 142,
"safe-buffer": 143,
"sha.js": 145
} ],
55: [ function(e, t, r) {
"use strict";
var i = e("inherits"), n = e("safe-buffer").Buffer, a = e("cipher-base"), s = n.alloc(128), f = 64;
function o(e, t) {
a.call(this, "digest");
"string" == typeof t && (t = n.from(t));
this._alg = e;
this._key = t;
t.length > f ? t = e(t) : t.length < f && (t = n.concat([ t, s ], f));
for (var r = this._ipad = n.allocUnsafe(f), i = this._opad = n.allocUnsafe(f), o = 0; o < f; o++) {
r[o] = 54 ^ t[o];
i[o] = 92 ^ t[o];
}
this._hash = [ r ];
}
i(o, a);
o.prototype._update = function(e) {
this._hash.push(e);
};
o.prototype._final = function() {
var e = this._alg(n.concat(this._hash));
return this._alg(n.concat([ this._opad, e ]));
};
t.exports = o;
}, {
"cipher-base": 49,
inherits: 101,
"safe-buffer": 143
} ],
56: [ function(e, t, r) {
"use strict";
r.randomBytes = r.rng = r.pseudoRandomBytes = r.prng = e("randombytes");
r.createHash = r.Hash = e("create-hash");
r.createHmac = r.Hmac = e("create-hmac");
var i = e("browserify-sign/algos"), n = Object.keys(i), a = [ "sha1", "sha224", "sha256", "sha384", "sha512", "md5", "rmd160" ].concat(n);
r.getHashes = function() {
return a;
};
var s = e("pbkdf2");
r.pbkdf2 = s.pbkdf2;
r.pbkdf2Sync = s.pbkdf2Sync;
var f = e("browserify-cipher");
r.Cipher = f.Cipher;
r.createCipher = f.createCipher;
r.Cipheriv = f.Cipheriv;
r.createCipheriv = f.createCipheriv;
r.Decipher = f.Decipher;
r.createDecipher = f.createDecipher;
r.Decipheriv = f.Decipheriv;
r.createDecipheriv = f.createDecipheriv;
r.getCiphers = f.getCiphers;
r.listCiphers = f.listCiphers;
var o = e("diffie-hellman");
r.DiffieHellmanGroup = o.DiffieHellmanGroup;
r.createDiffieHellmanGroup = o.createDiffieHellmanGroup;
r.getDiffieHellman = o.getDiffieHellman;
r.createDiffieHellman = o.createDiffieHellman;
r.DiffieHellman = o.DiffieHellman;
var c = e("browserify-sign");
r.createSign = c.createSign;
r.Sign = c.Sign;
r.createVerify = c.createVerify;
r.Verify = c.Verify;
r.createECDH = e("create-ecdh");
var h = e("public-encrypt");
r.publicEncrypt = h.publicEncrypt;
r.privateEncrypt = h.privateEncrypt;
r.publicDecrypt = h.publicDecrypt;
r.privateDecrypt = h.privateDecrypt;
var d = e("randomfill");
r.randomFill = d.randomFill;
r.randomFillSync = d.randomFillSync;
r.createCredentials = function() {
throw new Error([ "sorry, createCredentials is not implemented yet", "we accept pull requests", "https://github.com/crypto-browserify/crypto-browserify" ].join("\n"));
};
r.constants = {
DH_CHECK_P_NOT_SAFE_PRIME: 2,
DH_CHECK_P_NOT_PRIME: 1,
DH_UNABLE_TO_CHECK_GENERATOR: 4,
DH_NOT_SUITABLE_GENERATOR: 8,
NPN_ENABLED: 1,
ALPN_ENABLED: 1,
RSA_PKCS1_PADDING: 1,
RSA_SSLV23_PADDING: 2,
RSA_NO_PADDING: 3,
RSA_PKCS1_OAEP_PADDING: 4,
RSA_X931_PADDING: 5,
RSA_PKCS1_PSS_PADDING: 6,
POINT_CONVERSION_COMPRESSED: 2,
POINT_CONVERSION_UNCOMPRESSED: 4,
POINT_CONVERSION_HYBRID: 6
};
}, {
"browserify-cipher": 36,
"browserify-sign": 43,
"browserify-sign/algos": 40,
"create-ecdh": 51,
"create-hash": 52,
"create-hmac": 54,
"diffie-hellman": 63,
pbkdf2: 112,
"public-encrypt": 119,
randombytes: 125,
randomfill: 126
} ],
57: [ function(e, t, r) {
"use strict";
r.utils = e("./des/utils");
r.Cipher = e("./des/cipher");
r.DES = e("./des/des");
r.CBC = e("./des/cbc");
r.EDE = e("./des/ede");
}, {
"./des/cbc": 58,
"./des/cipher": 59,
"./des/des": 60,
"./des/ede": 61,
"./des/utils": 62
} ],
58: [ function(e, t, r) {
"use strict";
var i = e("minimalistic-assert"), n = e("inherits"), a = {};
r.instantiate = function(e) {
function t(t) {
e.call(this, t);
this._cbcInit();
}
n(t, e);
for (var r = Object.keys(a), i = 0; i < r.length; i++) {
var s = r[i];
t.prototype[s] = a[s];
}
t.create = function(e) {
return new t(e);
};
return t;
};
a._cbcInit = function() {
var e = new function(e) {
i.equal(e.length, 8, "Invalid IV length");
this.iv = new Array(8);
for (var t = 0; t < this.iv.length; t++) this.iv[t] = e[t];
}(this.options.iv);
this._cbcState = e;
};
a._update = function(e, t, r, i) {
var n = this._cbcState, a = this.constructor.super_.prototype, s = n.iv;
if ("encrypt" === this.type) {
for (var f = 0; f < this.blockSize; f++) s[f] ^= e[t + f];
a._update.call(this, s, 0, r, i);
for (f = 0; f < this.blockSize; f++) s[f] = r[i + f];
} else {
a._update.call(this, e, t, r, i);
for (f = 0; f < this.blockSize; f++) r[i + f] ^= s[f];
for (f = 0; f < this.blockSize; f++) s[f] = e[t + f];
}
};
}, {
inherits: 101,
"minimalistic-assert": 105
} ],
59: [ function(e, t, r) {
"use strict";
var i = e("minimalistic-assert");
function n(e) {
this.options = e;
this.type = this.options.type;
this.blockSize = 8;
this._init();
this.buffer = new Array(this.blockSize);
this.bufferOff = 0;
}
t.exports = n;
n.prototype._init = function() {};
n.prototype.update = function(e) {
return 0 === e.length ? [] : "decrypt" === this.type ? this._updateDecrypt(e) : this._updateEncrypt(e);
};
n.prototype._buffer = function(e, t) {
for (var r = Math.min(this.buffer.length - this.bufferOff, e.length - t), i = 0; i < r; i++) this.buffer[this.bufferOff + i] = e[t + i];
this.bufferOff += r;
return r;
};
n.prototype._flushBuffer = function(e, t) {
this._update(this.buffer, 0, e, t);
this.bufferOff = 0;
return this.blockSize;
};
n.prototype._updateEncrypt = function(e) {
var t = 0, r = 0, i = (this.bufferOff + e.length) / this.blockSize | 0, n = new Array(i * this.blockSize);
if (0 !== this.bufferOff) {
t += this._buffer(e, t);
this.bufferOff === this.buffer.length && (r += this._flushBuffer(n, r));
}
for (var a = e.length - (e.length - t) % this.blockSize; t < a; t += this.blockSize) {
this._update(e, t, n, r);
r += this.blockSize;
}
for (;t < e.length; t++, this.bufferOff++) this.buffer[this.bufferOff] = e[t];
return n;
};
n.prototype._updateDecrypt = function(e) {
for (var t = 0, r = 0, i = Math.ceil((this.bufferOff + e.length) / this.blockSize) - 1, n = new Array(i * this.blockSize); i > 0; i--) {
t += this._buffer(e, t);
r += this._flushBuffer(n, r);
}
t += this._buffer(e, t);
return n;
};
n.prototype.final = function(e) {
var t, r;
e && (t = this.update(e));
r = "encrypt" === this.type ? this._finalEncrypt() : this._finalDecrypt();
return t ? t.concat(r) : r;
};
n.prototype._pad = function(e, t) {
if (0 === t) return !1;
for (;t < e.length; ) e[t++] = 0;
return !0;
};
n.prototype._finalEncrypt = function() {
if (!this._pad(this.buffer, this.bufferOff)) return [];
var e = new Array(this.blockSize);
this._update(this.buffer, 0, e, 0);
return e;
};
n.prototype._unpad = function(e) {
return e;
};
n.prototype._finalDecrypt = function() {
i.equal(this.bufferOff, this.blockSize, "Not enough data to decrypt");
var e = new Array(this.blockSize);
this._flushBuffer(e, 0);
return this._unpad(e);
};
}, {
"minimalistic-assert": 105
} ],
60: [ function(e, t, r) {
"use strict";
var i = e("minimalistic-assert"), n = e("inherits"), a = e("../des"), s = a.utils, f = a.Cipher;
function o(e) {
f.call(this, e);
var t = new function() {
this.tmp = new Array(2);
this.keys = null;
}();
this._desState = t;
this.deriveKeys(t, e.key);
}
n(o, f);
t.exports = o;
o.create = function(e) {
return new o(e);
};
var c = [ 1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1 ];
o.prototype.deriveKeys = function(e, t) {
e.keys = new Array(32);
i.equal(t.length, this.blockSize, "Invalid key length");
var r = s.readUInt32BE(t, 0), n = s.readUInt32BE(t, 4);
s.pc1(r, n, e.tmp, 0);
r = e.tmp[0];
n = e.tmp[1];
for (var a = 0; a < e.keys.length; a += 2) {
var f = c[a >>> 1];
r = s.r28shl(r, f);
n = s.r28shl(n, f);
s.pc2(r, n, e.keys, a);
}
};
o.prototype._update = function(e, t, r, i) {
var n = this._desState, a = s.readUInt32BE(e, t), f = s.readUInt32BE(e, t + 4);
s.ip(a, f, n.tmp, 0);
a = n.tmp[0];
f = n.tmp[1];
"encrypt" === this.type ? this._encrypt(n, a, f, n.tmp, 0) : this._decrypt(n, a, f, n.tmp, 0);
a = n.tmp[0];
f = n.tmp[1];
s.writeUInt32BE(r, a, i);
s.writeUInt32BE(r, f, i + 4);
};
o.prototype._pad = function(e, t) {
for (var r = e.length - t, i = t; i < e.length; i++) e[i] = r;
return !0;
};
o.prototype._unpad = function(e) {
for (var t = e[e.length - 1], r = e.length - t; r < e.length; r++) i.equal(e[r], t);
return e.slice(0, e.length - t);
};
o.prototype._encrypt = function(e, t, r, i, n) {
for (var a = t, f = r, o = 0; o < e.keys.length; o += 2) {
var c = e.keys[o], h = e.keys[o + 1];
s.expand(f, e.tmp, 0);
c ^= e.tmp[0];
h ^= e.tmp[1];
var d = s.substitute(c, h), u = f;
f = (a ^ s.permute(d)) >>> 0;
a = u;
}
s.rip(f, a, i, n);
};
o.prototype._decrypt = function(e, t, r, i, n) {
for (var a = r, f = t, o = e.keys.length - 2; o >= 0; o -= 2) {
var c = e.keys[o], h = e.keys[o + 1];
s.expand(a, e.tmp, 0);
c ^= e.tmp[0];
h ^= e.tmp[1];
var d = s.substitute(c, h), u = a;
a = (f ^ s.permute(d)) >>> 0;
f = u;
}
s.rip(a, f, i, n);
};
}, {
"../des": 57,
inherits: 101,
"minimalistic-assert": 105
} ],
61: [ function(e, t, r) {
"use strict";
var i = e("minimalistic-assert"), n = e("inherits"), a = e("../des"), s = a.Cipher, f = a.DES;
function o(e) {
s.call(this, e);
var t = new function(e, t) {
i.equal(t.length, 24, "Invalid key length");
var r = t.slice(0, 8), n = t.slice(8, 16), a = t.slice(16, 24);
this.ciphers = "encrypt" === e ? [ f.create({
type: "encrypt",
key: r
}), f.create({
type: "decrypt",
key: n
}), f.create({
type: "encrypt",
key: a
}) ] : [ f.create({
type: "decrypt",
key: a
}), f.create({
type: "encrypt",
key: n
}), f.create({
type: "decrypt",
key: r
}) ];
}(this.type, this.options.key);
this._edeState = t;
}
n(o, s);
t.exports = o;
o.create = function(e) {
return new o(e);
};
o.prototype._update = function(e, t, r, i) {
var n = this._edeState;
n.ciphers[0]._update(e, t, r, i);
n.ciphers[1]._update(r, i, r, i);
n.ciphers[2]._update(r, i, r, i);
};
o.prototype._pad = f.prototype._pad;
o.prototype._unpad = f.prototype._unpad;
}, {
"../des": 57,
inherits: 101,
"minimalistic-assert": 105
} ],
62: [ function(e, t, r) {
"use strict";
r.readUInt32BE = function(e, t) {
return (e[0 + t] << 24 | e[1 + t] << 16 | e[2 + t] << 8 | e[3 + t]) >>> 0;
};
r.writeUInt32BE = function(e, t, r) {
e[0 + r] = t >>> 24;
e[1 + r] = t >>> 16 & 255;
e[2 + r] = t >>> 8 & 255;
e[3 + r] = 255 & t;
};
r.ip = function(e, t, r, i) {
for (var n = 0, a = 0, s = 6; s >= 0; s -= 2) {
for (var f = 0; f <= 24; f += 8) {
n <<= 1;
n |= t >>> f + s & 1;
}
for (f = 0; f <= 24; f += 8) {
n <<= 1;
n |= e >>> f + s & 1;
}
}
for (s = 6; s >= 0; s -= 2) {
for (f = 1; f <= 25; f += 8) {
a <<= 1;
a |= t >>> f + s & 1;
}
for (f = 1; f <= 25; f += 8) {
a <<= 1;
a |= e >>> f + s & 1;
}
}
r[i + 0] = n >>> 0;
r[i + 1] = a >>> 0;
};
r.rip = function(e, t, r, i) {
for (var n = 0, a = 0, s = 0; s < 4; s++) for (var f = 24; f >= 0; f -= 8) {
n <<= 1;
n |= t >>> f + s & 1;
n <<= 1;
n |= e >>> f + s & 1;
}
for (s = 4; s < 8; s++) for (f = 24; f >= 0; f -= 8) {
a <<= 1;
a |= t >>> f + s & 1;
a <<= 1;
a |= e >>> f + s & 1;
}
r[i + 0] = n >>> 0;
r[i + 1] = a >>> 0;
};
r.pc1 = function(e, t, r, i) {
for (var n = 0, a = 0, s = 7; s >= 5; s--) {
for (var f = 0; f <= 24; f += 8) {
n <<= 1;
n |= t >> f + s & 1;
}
for (f = 0; f <= 24; f += 8) {
n <<= 1;
n |= e >> f + s & 1;
}
}
for (f = 0; f <= 24; f += 8) {
n <<= 1;
n |= t >> f + s & 1;
}
for (s = 1; s <= 3; s++) {
for (f = 0; f <= 24; f += 8) {
a <<= 1;
a |= t >> f + s & 1;
}
for (f = 0; f <= 24; f += 8) {
a <<= 1;
a |= e >> f + s & 1;
}
}
for (f = 0; f <= 24; f += 8) {
a <<= 1;
a |= e >> f + s & 1;
}
r[i + 0] = n >>> 0;
r[i + 1] = a >>> 0;
};
r.r28shl = function(e, t) {
return e << t & 268435455 | e >>> 28 - t;
};
var i = [ 14, 11, 17, 4, 27, 23, 25, 0, 13, 22, 7, 18, 5, 9, 16, 24, 2, 20, 12, 21, 1, 8, 15, 26, 15, 4, 25, 19, 9, 1, 26, 16, 5, 11, 23, 8, 12, 7, 17, 0, 22, 3, 10, 14, 6, 20, 27, 24 ];
r.pc2 = function(e, t, r, n) {
for (var a = 0, s = 0, f = i.length >>> 1, o = 0; o < f; o++) {
a <<= 1;
a |= e >>> i[o] & 1;
}
for (o = f; o < i.length; o++) {
s <<= 1;
s |= t >>> i[o] & 1;
}
r[n + 0] = a >>> 0;
r[n + 1] = s >>> 0;
};
r.expand = function(e, t, r) {
var i = 0, n = 0;
i = (1 & e) << 5 | e >>> 27;
for (var a = 23; a >= 15; a -= 4) {
i <<= 6;
i |= e >>> a & 63;
}
for (a = 11; a >= 3; a -= 4) {
n |= e >>> a & 63;
n <<= 6;
}
n |= (31 & e) << 1 | e >>> 31;
t[r + 0] = i >>> 0;
t[r + 1] = n >>> 0;
};
var n = [ 14, 0, 4, 15, 13, 7, 1, 4, 2, 14, 15, 2, 11, 13, 8, 1, 3, 10, 10, 6, 6, 12, 12, 11, 5, 9, 9, 5, 0, 3, 7, 8, 4, 15, 1, 12, 14, 8, 8, 2, 13, 4, 6, 9, 2, 1, 11, 7, 15, 5, 12, 11, 9, 3, 7, 14, 3, 10, 10, 0, 5, 6, 0, 13, 15, 3, 1, 13, 8, 4, 14, 7, 6, 15, 11, 2, 3, 8, 4, 14, 9, 12, 7, 0, 2, 1, 13, 10, 12, 6, 0, 9, 5, 11, 10, 5, 0, 13, 14, 8, 7, 10, 11, 1, 10, 3, 4, 15, 13, 4, 1, 2, 5, 11, 8, 6, 12, 7, 6, 12, 9, 0, 3, 5, 2, 14, 15, 9, 10, 13, 0, 7, 9, 0, 14, 9, 6, 3, 3, 4, 15, 6, 5, 10, 1, 2, 13, 8, 12, 5, 7, 14, 11, 12, 4, 11, 2, 15, 8, 1, 13, 1, 6, 10, 4, 13, 9, 0, 8, 6, 15, 9, 3, 8, 0, 7, 11, 4, 1, 15, 2, 14, 12, 3, 5, 11, 10, 5, 14, 2, 7, 12, 7, 13, 13, 8, 14, 11, 3, 5, 0, 6, 6, 15, 9, 0, 10, 3, 1, 4, 2, 7, 8, 2, 5, 12, 11, 1, 12, 10, 4, 14, 15, 9, 10, 3, 6, 15, 9, 0, 0, 6, 12, 10, 11, 1, 7, 13, 13, 8, 15, 9, 1, 4, 3, 5, 14, 11, 5, 12, 2, 7, 8, 2, 4, 14, 2, 14, 12, 11, 4, 2, 1, 12, 7, 4, 10, 7, 11, 13, 6, 1, 8, 5, 5, 0, 3, 15, 15, 10, 13, 3, 0, 9, 14, 8, 9, 6, 4, 11, 2, 8, 1, 12, 11, 7, 10, 1, 13, 14, 7, 2, 8, 13, 15, 6, 9, 15, 12, 0, 5, 9, 6, 10, 3, 4, 0, 5, 14, 3, 12, 10, 1, 15, 10, 4, 15, 2, 9, 7, 2, 12, 6, 9, 8, 5, 0, 6, 13, 1, 3, 13, 4, 14, 14, 0, 7, 11, 5, 3, 11, 8, 9, 4, 14, 3, 15, 2, 5, 12, 2, 9, 8, 5, 12, 15, 3, 10, 7, 11, 0, 14, 4, 1, 10, 7, 1, 6, 13, 0, 11, 8, 6, 13, 4, 13, 11, 0, 2, 11, 14, 7, 15, 4, 0, 9, 8, 1, 13, 10, 3, 14, 12, 3, 9, 5, 7, 12, 5, 2, 10, 15, 6, 8, 1, 6, 1, 6, 4, 11, 11, 13, 13, 8, 12, 1, 3, 4, 7, 10, 14, 7, 10, 9, 15, 5, 6, 0, 8, 15, 0, 14, 5, 2, 9, 3, 2, 12, 13, 1, 2, 15, 8, 13, 4, 8, 6, 10, 15, 3, 11, 7, 1, 4, 10, 12, 9, 5, 3, 6, 14, 11, 5, 0, 0, 14, 12, 9, 7, 2, 7, 2, 11, 1, 4, 14, 1, 7, 9, 4, 12, 10, 14, 8, 2, 13, 0, 15, 6, 12, 10, 9, 13, 0, 15, 3, 3, 5, 5, 6, 8, 11 ];
r.substitute = function(e, t) {
for (var r = 0, i = 0; i < 4; i++) {
r <<= 4;
r |= n[64 * i + (e >>> 18 - 6 * i & 63)];
}
for (i = 0; i < 4; i++) {
r <<= 4;
r |= n[256 + 64 * i + (t >>> 18 - 6 * i & 63)];
}
return r >>> 0;
};
var a = [ 16, 25, 12, 11, 3, 20, 4, 15, 31, 17, 9, 6, 27, 14, 1, 22, 30, 24, 8, 18, 0, 5, 29, 23, 13, 19, 2, 26, 10, 21, 28, 7 ];
r.permute = function(e) {
for (var t = 0, r = 0; r < a.length; r++) {
t <<= 1;
t |= e >>> a[r] & 1;
}
return t >>> 0;
};
r.padSplit = function(e, t, r) {
for (var i = e.toString(2); i.length < t; ) i = "0" + i;
for (var n = [], a = 0; a < t; a += r) n.push(i.slice(a, a + r));
return n.join(" ");
};
}, {} ],
63: [ function(e, t, r) {
(function(t) {
var i = e("./lib/generatePrime"), n = e("./lib/primes.json"), a = e("./lib/dh");
var s = {
binary: !0,
hex: !0,
base64: !0
};
r.DiffieHellmanGroup = r.createDiffieHellmanGroup = r.getDiffieHellman = function(e) {
var r = new t(n[e].prime, "hex"), i = new t(n[e].gen, "hex");
return new a(r, i);
};
r.createDiffieHellman = r.DiffieHellman = function e(r, n, f, o) {
if (t.isBuffer(n) || void 0 === s[n]) return e(r, "binary", n, f);
n = n || "binary";
o = o || "binary";
f = f || new t([ 2 ]);
t.isBuffer(f) || (f = new t(f, o));
if ("number" == typeof r) return new a(i(r, f), f, !0);
t.isBuffer(r) || (r = new t(r, n));
return new a(r, f, !0);
};
}).call(this, e("buffer").Buffer);
}, {
"./lib/dh": 64,
"./lib/generatePrime": 65,
"./lib/primes.json": 66,
buffer: 47
} ],
64: [ function(e, t, r) {
(function(r) {
var i = e("bn.js"), n = new (e("miller-rabin"))(), a = new i(24), s = new i(11), f = new i(10), o = new i(3), c = new i(7), h = e("./generatePrime"), d = e("randombytes");
t.exports = b;
function u(e, t) {
t = t || "utf8";
r.isBuffer(e) || (e = new r(e, t));
this._pub = new i(e);
return this;
}
function l(e, t) {
t = t || "utf8";
r.isBuffer(e) || (e = new r(e, t));
this._priv = new i(e);
return this;
}
var p = {};
function b(e, t, r) {
this.setGenerator(t);
this.__prime = new i(e);
this._prime = i.mont(this.__prime);
this._primeLen = e.length;
this._pub = void 0;
this._priv = void 0;
this._primeCode = void 0;
if (r) {
this.setPublicKey = u;
this.setPrivateKey = l;
} else this._primeCode = 8;
}
Object.defineProperty(b.prototype, "verifyError", {
enumerable: !0,
get: function() {
"number" != typeof this._primeCode && (this._primeCode = function(e, t) {
var r = t.toString("hex"), i = [ r, e.toString(16) ].join("_");
if (i in p) return p[i];
var d, u = 0;
if (e.isEven() || !h.simpleSieve || !h.fermatTest(e) || !n.test(e)) {
u += 1;
u += "02" === r || "05" === r ? 8 : 4;
p[i] = u;
return u;
}
n.test(e.shrn(1)) || (u += 2);
switch (r) {
case "02":
e.mod(a).cmp(s) && (u += 8);
break;

case "05":
(d = e.mod(f)).cmp(o) && d.cmp(c) && (u += 8);
break;

default:
u += 4;
}
p[i] = u;
return u;
}(this.__prime, this.__gen));
return this._primeCode;
}
});
b.prototype.generateKeys = function() {
this._priv || (this._priv = new i(d(this._primeLen)));
this._pub = this._gen.toRed(this._prime).redPow(this._priv).fromRed();
return this.getPublicKey();
};
b.prototype.computeSecret = function(e) {
var t = (e = (e = new i(e)).toRed(this._prime)).redPow(this._priv).fromRed(), n = new r(t.toArray()), a = this.getPrime();
if (n.length < a.length) {
var s = new r(a.length - n.length);
s.fill(0);
n = r.concat([ s, n ]);
}
return n;
};
b.prototype.getPublicKey = function(e) {
return g(this._pub, e);
};
b.prototype.getPrivateKey = function(e) {
return g(this._priv, e);
};
b.prototype.getPrime = function(e) {
return g(this.__prime, e);
};
b.prototype.getGenerator = function(e) {
return g(this._gen, e);
};
b.prototype.setGenerator = function(e, t) {
t = t || "utf8";
r.isBuffer(e) || (e = new r(e, t));
this.__gen = e;
this._gen = new i(e);
return this;
};
function g(e, t) {
var i = new r(e.toArray());
return t ? i.toString(t) : i;
}
}).call(this, e("buffer").Buffer);
}, {
"./generatePrime": 65,
"bn.js": 16,
buffer: 47,
"miller-rabin": 104,
randombytes: 125
} ],
65: [ function(e, t, r) {
var i = e("randombytes");
t.exports = y;
y.simpleSieve = g;
y.fermatTest = m;
var n = e("bn.js"), a = new n(24), s = new (e("miller-rabin"))(), f = new n(1), o = new n(2), c = new n(5), h = (new n(16), 
new n(8), new n(10)), d = new n(3), u = (new n(7), new n(11)), l = new n(4), p = (new n(12), 
null);
function b() {
if (null !== p) return p;
var e = [];
e[0] = 2;
for (var t = 1, r = 3; r < 1048576; r += 2) {
for (var i = Math.ceil(Math.sqrt(r)), n = 0; n < t && e[n] <= i && r % e[n] != 0; n++) ;
t !== n && e[n] <= i || (e[t++] = r);
}
p = e;
return e;
}
function g(e) {
for (var t = b(), r = 0; r < t.length; r++) if (0 === e.modn(t[r])) return 0 === e.cmpn(t[r]);
return !0;
}
function m(e) {
var t = n.mont(e);
return 0 === o.toRed(t).redPow(e.subn(1)).fromRed().cmpn(1);
}
function y(e, t) {
if (e < 16) return new n(2 === t || 5 === t ? [ 140, 123 ] : [ 140, 39 ]);
t = new n(t);
for (var r, p; ;) {
r = new n(i(Math.ceil(e / 8)));
for (;r.bitLength() > e; ) r.ishrn(1);
r.isEven() && r.iadd(f);
r.testn(1) || r.iadd(o);
if (t.cmp(o)) {
if (!t.cmp(c)) for (;r.mod(h).cmp(d); ) r.iadd(l);
} else for (;r.mod(a).cmp(u); ) r.iadd(l);
if (g(p = r.shrn(1)) && g(r) && m(p) && m(r) && s.test(p) && s.test(r)) return r;
}
}
}, {
"bn.js": 16,
"miller-rabin": 104,
randombytes: 125
} ],
66: [ function(e, t, r) {
t.exports = {
modp1: {
gen: "02",
prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a63a3620ffffffffffffffff"
},
modp2: {
gen: "02",
prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece65381ffffffffffffffff"
},
modp5: {
gen: "02",
prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca237327ffffffffffffffff"
},
modp14: {
gen: "02",
prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aacaa68ffffffffffffffff"
},
modp15: {
gen: "02",
prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a93ad2caffffffffffffffff"
},
modp16: {
gen: "02",
prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c934063199ffffffffffffffff"
},
modp17: {
gen: "02",
prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c93402849236c3fab4d27c7026c1d4dcb2602646dec9751e763dba37bdf8ff9406ad9e530ee5db382f413001aeb06a53ed9027d831179727b0865a8918da3edbebcf9b14ed44ce6cbaced4bb1bdb7f1447e6cc254b332051512bd7af426fb8f401378cd2bf5983ca01c64b92ecf032ea15d1721d03f482d7ce6e74fef6d55e702f46980c82b5a84031900b1c9e59e7c97fbec7e8f323a97a7e36cc88be0f1d45b7ff585ac54bd407b22b4154aacc8f6d7ebf48e1d814cc5ed20f8037e0a79715eef29be32806a1d58bb7c5da76f550aa3d8a1fbff0eb19ccb1a313d55cda56c9ec2ef29632387fe8d76e3c0468043e8f663f4860ee12bf2d5b0b7474d6e694f91e6dcc4024ffffffffffffffff"
},
modp18: {
gen: "02",
prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c93402849236c3fab4d27c7026c1d4dcb2602646dec9751e763dba37bdf8ff9406ad9e530ee5db382f413001aeb06a53ed9027d831179727b0865a8918da3edbebcf9b14ed44ce6cbaced4bb1bdb7f1447e6cc254b332051512bd7af426fb8f401378cd2bf5983ca01c64b92ecf032ea15d1721d03f482d7ce6e74fef6d55e702f46980c82b5a84031900b1c9e59e7c97fbec7e8f323a97a7e36cc88be0f1d45b7ff585ac54bd407b22b4154aacc8f6d7ebf48e1d814cc5ed20f8037e0a79715eef29be32806a1d58bb7c5da76f550aa3d8a1fbff0eb19ccb1a313d55cda56c9ec2ef29632387fe8d76e3c0468043e8f663f4860ee12bf2d5b0b7474d6e694f91e6dbe115974a3926f12fee5e438777cb6a932df8cd8bec4d073b931ba3bc832b68d9dd300741fa7bf8afc47ed2576f6936ba424663aab639c5ae4f5683423b4742bf1c978238f16cbe39d652de3fdb8befc848ad922222e04a4037c0713eb57a81a23f0c73473fc646cea306b4bcbc8862f8385ddfa9d4b7fa2c087e879683303ed5bdd3a062b3cf5b3a278a66d2a13f83f44f82ddf310ee074ab6a364597e899a0255dc164f31cc50846851df9ab48195ded7ea1b1d510bd7ee74d73faf36bc31ecfa268359046f4eb879f924009438b481c6cd7889a002ed5ee382bc9190da6fc026e479558e4475677e9aa9e3050e2765694dfc81f56e880b96e7160c980dd98edd3dfffffffffffffffff"
}
};
}, {} ],
67: [ function(e, t, r) {
"use strict";
var i = r;
i.version = e("../package.json").version;
i.utils = e("./elliptic/utils");
i.rand = e("brorand");
i.curve = e("./elliptic/curve");
i.curves = e("./elliptic/curves");
i.ec = e("./elliptic/ec");
i.eddsa = e("./elliptic/eddsa");
}, {
"../package.json": 82,
"./elliptic/curve": 70,
"./elliptic/curves": 73,
"./elliptic/ec": 74,
"./elliptic/eddsa": 77,
"./elliptic/utils": 81,
brorand: 17
} ],
68: [ function(e, t, r) {
"use strict";
var i = e("bn.js"), n = e("../../elliptic").utils, a = n.getNAF, s = n.getJSF, f = n.assert;
function o(e, t) {
this.type = e;
this.p = new i(t.p, 16);
this.red = t.prime ? i.red(t.prime) : i.mont(this.p);
this.zero = new i(0).toRed(this.red);
this.one = new i(1).toRed(this.red);
this.two = new i(2).toRed(this.red);
this.n = t.n && new i(t.n, 16);
this.g = t.g && this.pointFromJSON(t.g, t.gRed);
this._wnafT1 = new Array(4);
this._wnafT2 = new Array(4);
this._wnafT3 = new Array(4);
this._wnafT4 = new Array(4);
var r = this.n && this.p.div(this.n);
if (!r || r.cmpn(100) > 0) this.redN = null; else {
this._maxwellTrick = !0;
this.redN = this.n.toRed(this.red);
}
}
t.exports = o;
o.prototype.point = function() {
throw new Error("Not implemented");
};
o.prototype.validate = function() {
throw new Error("Not implemented");
};
o.prototype._fixedNafMul = function(e, t) {
f(e.precomputed);
var r = e._getDoubles(), i = a(t, 1), n = (1 << r.step + 1) - (r.step % 2 == 0 ? 2 : 1);
n /= 3;
for (var s = [], o = 0; o < i.length; o += r.step) {
var c = 0;
for (t = o + r.step - 1; t >= o; t--) c = (c << 1) + i[t];
s.push(c);
}
for (var h = this.jpoint(null, null, null), d = this.jpoint(null, null, null), u = n; u > 0; u--) {
for (o = 0; o < s.length; o++) {
(c = s[o]) === u ? d = d.mixedAdd(r.points[o]) : c === -u && (d = d.mixedAdd(r.points[o].neg()));
}
h = h.add(d);
}
return h.toP();
};
o.prototype._wnafMul = function(e, t) {
var r = 4, i = e._getNAFPoints(r);
r = i.wnd;
for (var n = i.points, s = a(t, r), o = this.jpoint(null, null, null), c = s.length - 1; c >= 0; c--) {
for (t = 0; c >= 0 && 0 === s[c]; c--) t++;
c >= 0 && t++;
o = o.dblp(t);
if (c < 0) break;
var h = s[c];
f(0 !== h);
o = "affine" === e.type ? h > 0 ? o.mixedAdd(n[h - 1 >> 1]) : o.mixedAdd(n[-h - 1 >> 1].neg()) : h > 0 ? o.add(n[h - 1 >> 1]) : o.add(n[-h - 1 >> 1].neg());
}
return "affine" === e.type ? o.toP() : o;
};
o.prototype._wnafMulAdd = function(e, t, r, i, n) {
for (var f = this._wnafT1, o = this._wnafT2, c = this._wnafT3, h = 0, d = 0; d < i; d++) {
var u = (k = t[d])._getNAFPoints(e);
f[d] = u.wnd;
o[d] = u.points;
}
for (d = i - 1; d >= 1; d -= 2) {
var l = d - 1, p = d;
if (1 === f[l] && 1 === f[p]) {
var b = [ t[l], null, null, t[p] ];
if (0 === t[l].y.cmp(t[p].y)) {
b[1] = t[l].add(t[p]);
b[2] = t[l].toJ().mixedAdd(t[p].neg());
} else if (0 === t[l].y.cmp(t[p].y.redNeg())) {
b[1] = t[l].toJ().mixedAdd(t[p]);
b[2] = t[l].add(t[p].neg());
} else {
b[1] = t[l].toJ().mixedAdd(t[p]);
b[2] = t[l].toJ().mixedAdd(t[p].neg());
}
var g = [ -3, -1, -5, -7, 0, 7, 5, 1, 3 ], m = s(r[l], r[p]);
h = Math.max(m[0].length, h);
c[l] = new Array(h);
c[p] = new Array(h);
for (var y = 0; y < h; y++) {
var v = 0 | m[0][y], _ = 0 | m[1][y];
c[l][y] = g[3 * (v + 1) + (_ + 1)];
c[p][y] = 0;
o[l] = b;
}
} else {
c[l] = a(r[l], f[l]);
c[p] = a(r[p], f[p]);
h = Math.max(c[l].length, h);
h = Math.max(c[p].length, h);
}
}
var w = this.jpoint(null, null, null), S = this._wnafT4;
for (d = h; d >= 0; d--) {
for (var E = 0; d >= 0; ) {
var M = !0;
for (y = 0; y < i; y++) {
S[y] = 0 | c[y][d];
0 !== S[y] && (M = !1);
}
if (!M) break;
E++;
d--;
}
d >= 0 && E++;
w = w.dblp(E);
if (d < 0) break;
for (y = 0; y < i; y++) {
var k, A = S[y];
if (0 !== A) {
A > 0 ? k = o[y][A - 1 >> 1] : A < 0 && (k = o[y][-A - 1 >> 1].neg());
w = "affine" === k.type ? w.mixedAdd(k) : w.add(k);
}
}
}
for (d = 0; d < i; d++) o[d] = null;
return n ? w : w.toP();
};
function c(e, t) {
this.curve = e;
this.type = t;
this.precomputed = null;
}
o.BasePoint = c;
c.prototype.eq = function() {
throw new Error("Not implemented");
};
c.prototype.validate = function() {
return this.curve.validate(this);
};
o.prototype.decodePoint = function(e, t) {
e = n.toArray(e, t);
var r = this.p.byteLength();
if ((4 === e[0] || 6 === e[0] || 7 === e[0]) && e.length - 1 == 2 * r) {
6 === e[0] ? f(e[e.length - 1] % 2 == 0) : 7 === e[0] && f(e[e.length - 1] % 2 == 1);
return this.point(e.slice(1, 1 + r), e.slice(1 + r, 1 + 2 * r));
}
if ((2 === e[0] || 3 === e[0]) && e.length - 1 === r) return this.pointFromX(e.slice(1, 1 + r), 3 === e[0]);
throw new Error("Unknown point format");
};
c.prototype.encodeCompressed = function(e) {
return this.encode(e, !0);
};
c.prototype._encode = function(e) {
var t = this.curve.p.byteLength(), r = this.getX().toArray("be", t);
return e ? [ this.getY().isEven() ? 2 : 3 ].concat(r) : [ 4 ].concat(r, this.getY().toArray("be", t));
};
c.prototype.encode = function(e, t) {
return n.encode(this._encode(t), e);
};
c.prototype.precompute = function(e) {
if (this.precomputed) return this;
var t = {
doubles: null,
naf: null,
beta: null
};
t.naf = this._getNAFPoints(8);
t.doubles = this._getDoubles(4, e);
t.beta = this._getBeta();
this.precomputed = t;
return this;
};
c.prototype._hasDoubles = function(e) {
if (!this.precomputed) return !1;
var t = this.precomputed.doubles;
return !!t && t.points.length >= Math.ceil((e.bitLength() + 1) / t.step);
};
c.prototype._getDoubles = function(e, t) {
if (this.precomputed && this.precomputed.doubles) return this.precomputed.doubles;
for (var r = [ this ], i = this, n = 0; n < t; n += e) {
for (var a = 0; a < e; a++) i = i.dbl();
r.push(i);
}
return {
step: e,
points: r
};
};
c.prototype._getNAFPoints = function(e) {
if (this.precomputed && this.precomputed.naf) return this.precomputed.naf;
for (var t = [ this ], r = (1 << e) - 1, i = 1 === r ? null : this.dbl(), n = 1; n < r; n++) t[n] = t[n - 1].add(i);
return {
wnd: e,
points: t
};
};
c.prototype._getBeta = function() {
return null;
};
c.prototype.dblp = function(e) {
for (var t = this, r = 0; r < e; r++) t = t.dbl();
return t;
};
}, {
"../../elliptic": 67,
"bn.js": 16
} ],
69: [ function(e, t, r) {
"use strict";
var i = e("../curve"), n = e("../../elliptic"), a = e("bn.js"), s = e("inherits"), f = i.base, o = n.utils.assert;
function c(e) {
this.twisted = 1 != (0 | e.a);
this.mOneA = this.twisted && -1 == (0 | e.a);
this.extended = this.mOneA;
f.call(this, "edwards", e);
this.a = new a(e.a, 16).umod(this.red.m);
this.a = this.a.toRed(this.red);
this.c = new a(e.c, 16).toRed(this.red);
this.c2 = this.c.redSqr();
this.d = new a(e.d, 16).toRed(this.red);
this.dd = this.d.redAdd(this.d);
o(!this.twisted || 0 === this.c.fromRed().cmpn(1));
this.oneC = 1 == (0 | e.c);
}
s(c, f);
t.exports = c;
c.prototype._mulA = function(e) {
return this.mOneA ? e.redNeg() : this.a.redMul(e);
};
c.prototype._mulC = function(e) {
return this.oneC ? e : this.c.redMul(e);
};
c.prototype.jpoint = function(e, t, r, i) {
return this.point(e, t, r, i);
};
c.prototype.pointFromX = function(e, t) {
(e = new a(e, 16)).red || (e = e.toRed(this.red));
var r = e.redSqr(), i = this.c2.redSub(this.a.redMul(r)), n = this.one.redSub(this.c2.redMul(this.d).redMul(r)), s = i.redMul(n.redInvm()), f = s.redSqrt();
if (0 !== f.redSqr().redSub(s).cmp(this.zero)) throw new Error("invalid point");
var o = f.fromRed().isOdd();
(t && !o || !t && o) && (f = f.redNeg());
return this.point(e, f);
};
c.prototype.pointFromY = function(e, t) {
(e = new a(e, 16)).red || (e = e.toRed(this.red));
var r = e.redSqr(), i = r.redSub(this.c2), n = r.redMul(this.d).redMul(this.c2).redSub(this.a), s = i.redMul(n.redInvm());
if (0 === s.cmp(this.zero)) {
if (t) throw new Error("invalid point");
return this.point(this.zero, e);
}
var f = s.redSqrt();
if (0 !== f.redSqr().redSub(s).cmp(this.zero)) throw new Error("invalid point");
f.fromRed().isOdd() !== t && (f = f.redNeg());
return this.point(f, e);
};
c.prototype.validate = function(e) {
if (e.isInfinity()) return !0;
e.normalize();
var t = e.x.redSqr(), r = e.y.redSqr(), i = t.redMul(this.a).redAdd(r), n = this.c2.redMul(this.one.redAdd(this.d.redMul(t).redMul(r)));
return 0 === i.cmp(n);
};
function h(e, t, r, i, n) {
f.BasePoint.call(this, e, "projective");
if (null === t && null === r && null === i) {
this.x = this.curve.zero;
this.y = this.curve.one;
this.z = this.curve.one;
this.t = this.curve.zero;
this.zOne = !0;
} else {
this.x = new a(t, 16);
this.y = new a(r, 16);
this.z = i ? new a(i, 16) : this.curve.one;
this.t = n && new a(n, 16);
this.x.red || (this.x = this.x.toRed(this.curve.red));
this.y.red || (this.y = this.y.toRed(this.curve.red));
this.z.red || (this.z = this.z.toRed(this.curve.red));
this.t && !this.t.red && (this.t = this.t.toRed(this.curve.red));
this.zOne = this.z === this.curve.one;
if (this.curve.extended && !this.t) {
this.t = this.x.redMul(this.y);
this.zOne || (this.t = this.t.redMul(this.z.redInvm()));
}
}
}
s(h, f.BasePoint);
c.prototype.pointFromJSON = function(e) {
return h.fromJSON(this, e);
};
c.prototype.point = function(e, t, r, i) {
return new h(this, e, t, r, i);
};
h.fromJSON = function(e, t) {
return new h(e, t[0], t[1], t[2]);
};
h.prototype.inspect = function() {
return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + " z: " + this.z.fromRed().toString(16, 2) + ">";
};
h.prototype.isInfinity = function() {
return 0 === this.x.cmpn(0) && (0 === this.y.cmp(this.z) || this.zOne && 0 === this.y.cmp(this.curve.c));
};
h.prototype._extDbl = function() {
var e = this.x.redSqr(), t = this.y.redSqr(), r = this.z.redSqr();
r = r.redIAdd(r);
var i = this.curve._mulA(e), n = this.x.redAdd(this.y).redSqr().redISub(e).redISub(t), a = i.redAdd(t), s = a.redSub(r), f = i.redSub(t), o = n.redMul(s), c = a.redMul(f), h = n.redMul(f), d = s.redMul(a);
return this.curve.point(o, c, d, h);
};
h.prototype._projDbl = function() {
var e, t, r, i = this.x.redAdd(this.y).redSqr(), n = this.x.redSqr(), a = this.y.redSqr();
if (this.curve.twisted) {
var s = (c = this.curve._mulA(n)).redAdd(a);
if (this.zOne) {
e = i.redSub(n).redSub(a).redMul(s.redSub(this.curve.two));
t = s.redMul(c.redSub(a));
r = s.redSqr().redSub(s).redSub(s);
} else {
var f = this.z.redSqr(), o = s.redSub(f).redISub(f);
e = i.redSub(n).redISub(a).redMul(o);
t = s.redMul(c.redSub(a));
r = s.redMul(o);
}
} else {
var c = n.redAdd(a);
f = this.curve._mulC(this.z).redSqr(), o = c.redSub(f).redSub(f);
e = this.curve._mulC(i.redISub(c)).redMul(o);
t = this.curve._mulC(c).redMul(n.redISub(a));
r = c.redMul(o);
}
return this.curve.point(e, t, r);
};
h.prototype.dbl = function() {
return this.isInfinity() ? this : this.curve.extended ? this._extDbl() : this._projDbl();
};
h.prototype._extAdd = function(e) {
var t = this.y.redSub(this.x).redMul(e.y.redSub(e.x)), r = this.y.redAdd(this.x).redMul(e.y.redAdd(e.x)), i = this.t.redMul(this.curve.dd).redMul(e.t), n = this.z.redMul(e.z.redAdd(e.z)), a = r.redSub(t), s = n.redSub(i), f = n.redAdd(i), o = r.redAdd(t), c = a.redMul(s), h = f.redMul(o), d = a.redMul(o), u = s.redMul(f);
return this.curve.point(c, h, u, d);
};
h.prototype._projAdd = function(e) {
var t, r, i = this.z.redMul(e.z), n = i.redSqr(), a = this.x.redMul(e.x), s = this.y.redMul(e.y), f = this.curve.d.redMul(a).redMul(s), o = n.redSub(f), c = n.redAdd(f), h = this.x.redAdd(this.y).redMul(e.x.redAdd(e.y)).redISub(a).redISub(s), d = i.redMul(o).redMul(h);
if (this.curve.twisted) {
t = i.redMul(c).redMul(s.redSub(this.curve._mulA(a)));
r = o.redMul(c);
} else {
t = i.redMul(c).redMul(s.redSub(a));
r = this.curve._mulC(o).redMul(c);
}
return this.curve.point(d, t, r);
};
h.prototype.add = function(e) {
return this.isInfinity() ? e : e.isInfinity() ? this : this.curve.extended ? this._extAdd(e) : this._projAdd(e);
};
h.prototype.mul = function(e) {
return this._hasDoubles(e) ? this.curve._fixedNafMul(this, e) : this.curve._wnafMul(this, e);
};
h.prototype.mulAdd = function(e, t, r) {
return this.curve._wnafMulAdd(1, [ this, t ], [ e, r ], 2, !1);
};
h.prototype.jmulAdd = function(e, t, r) {
return this.curve._wnafMulAdd(1, [ this, t ], [ e, r ], 2, !0);
};
h.prototype.normalize = function() {
if (this.zOne) return this;
var e = this.z.redInvm();
this.x = this.x.redMul(e);
this.y = this.y.redMul(e);
this.t && (this.t = this.t.redMul(e));
this.z = this.curve.one;
this.zOne = !0;
return this;
};
h.prototype.neg = function() {
return this.curve.point(this.x.redNeg(), this.y, this.z, this.t && this.t.redNeg());
};
h.prototype.getX = function() {
this.normalize();
return this.x.fromRed();
};
h.prototype.getY = function() {
this.normalize();
return this.y.fromRed();
};
h.prototype.eq = function(e) {
return this === e || 0 === this.getX().cmp(e.getX()) && 0 === this.getY().cmp(e.getY());
};
h.prototype.eqXToP = function(e) {
var t = e.toRed(this.curve.red).redMul(this.z);
if (0 === this.x.cmp(t)) return !0;
for (var r = e.clone(), i = this.curve.redN.redMul(this.z); ;) {
r.iadd(this.curve.n);
if (r.cmp(this.curve.p) >= 0) return !1;
t.redIAdd(i);
if (0 === this.x.cmp(t)) return !0;
}
};
h.prototype.toP = h.prototype.normalize;
h.prototype.mixedAdd = h.prototype.add;
}, {
"../../elliptic": 67,
"../curve": 70,
"bn.js": 16,
inherits: 101
} ],
70: [ function(e, t, r) {
"use strict";
var i = r;
i.base = e("./base");
i.short = e("./short");
i.mont = e("./mont");
i.edwards = e("./edwards");
}, {
"./base": 68,
"./edwards": 69,
"./mont": 71,
"./short": 72
} ],
71: [ function(e, t, r) {
"use strict";
var i = e("../curve"), n = e("bn.js"), a = e("inherits"), s = i.base, f = e("../../elliptic").utils;
function o(e) {
s.call(this, "mont", e);
this.a = new n(e.a, 16).toRed(this.red);
this.b = new n(e.b, 16).toRed(this.red);
this.i4 = new n(4).toRed(this.red).redInvm();
this.two = new n(2).toRed(this.red);
this.a24 = this.i4.redMul(this.a.redAdd(this.two));
}
a(o, s);
t.exports = o;
o.prototype.validate = function(e) {
var t = e.normalize().x, r = t.redSqr(), i = r.redMul(t).redAdd(r.redMul(this.a)).redAdd(t);
return 0 === i.redSqrt().redSqr().cmp(i);
};
function c(e, t, r) {
s.BasePoint.call(this, e, "projective");
if (null === t && null === r) {
this.x = this.curve.one;
this.z = this.curve.zero;
} else {
this.x = new n(t, 16);
this.z = new n(r, 16);
this.x.red || (this.x = this.x.toRed(this.curve.red));
this.z.red || (this.z = this.z.toRed(this.curve.red));
}
}
a(c, s.BasePoint);
o.prototype.decodePoint = function(e, t) {
return this.point(f.toArray(e, t), 1);
};
o.prototype.point = function(e, t) {
return new c(this, e, t);
};
o.prototype.pointFromJSON = function(e) {
return c.fromJSON(this, e);
};
c.prototype.precompute = function() {};
c.prototype._encode = function() {
return this.getX().toArray("be", this.curve.p.byteLength());
};
c.fromJSON = function(e, t) {
return new c(e, t[0], t[1] || e.one);
};
c.prototype.inspect = function() {
return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " z: " + this.z.fromRed().toString(16, 2) + ">";
};
c.prototype.isInfinity = function() {
return 0 === this.z.cmpn(0);
};
c.prototype.dbl = function() {
var e = this.x.redAdd(this.z).redSqr(), t = this.x.redSub(this.z).redSqr(), r = e.redSub(t), i = e.redMul(t), n = r.redMul(t.redAdd(this.curve.a24.redMul(r)));
return this.curve.point(i, n);
};
c.prototype.add = function() {
throw new Error("Not supported on Montgomery curve");
};
c.prototype.diffAdd = function(e, t) {
var r = this.x.redAdd(this.z), i = this.x.redSub(this.z), n = e.x.redAdd(e.z), a = e.x.redSub(e.z).redMul(r), s = n.redMul(i), f = t.z.redMul(a.redAdd(s).redSqr()), o = t.x.redMul(a.redISub(s).redSqr());
return this.curve.point(f, o);
};
c.prototype.mul = function(e) {
for (var t = e.clone(), r = this, i = this.curve.point(null, null), n = []; 0 !== t.cmpn(0); t.iushrn(1)) n.push(t.andln(1));
for (var a = n.length - 1; a >= 0; a--) if (0 === n[a]) {
r = r.diffAdd(i, this);
i = i.dbl();
} else {
i = r.diffAdd(i, this);
r = r.dbl();
}
return i;
};
c.prototype.mulAdd = function() {
throw new Error("Not supported on Montgomery curve");
};
c.prototype.jumlAdd = function() {
throw new Error("Not supported on Montgomery curve");
};
c.prototype.eq = function(e) {
return 0 === this.getX().cmp(e.getX());
};
c.prototype.normalize = function() {
this.x = this.x.redMul(this.z.redInvm());
this.z = this.curve.one;
return this;
};
c.prototype.getX = function() {
this.normalize();
return this.x.fromRed();
};
}, {
"../../elliptic": 67,
"../curve": 70,
"bn.js": 16,
inherits: 101
} ],
72: [ function(e, t, r) {
"use strict";
var i = e("../curve"), n = e("../../elliptic"), a = e("bn.js"), s = e("inherits"), f = i.base, o = n.utils.assert;
function c(e) {
f.call(this, "short", e);
this.a = new a(e.a, 16).toRed(this.red);
this.b = new a(e.b, 16).toRed(this.red);
this.tinv = this.two.redInvm();
this.zeroA = 0 === this.a.fromRed().cmpn(0);
this.threeA = 0 === this.a.fromRed().sub(this.p).cmpn(-3);
this.endo = this._getEndomorphism(e);
this._endoWnafT1 = new Array(4);
this._endoWnafT2 = new Array(4);
}
s(c, f);
t.exports = c;
c.prototype._getEndomorphism = function(e) {
if (this.zeroA && this.g && this.n && 1 === this.p.modn(3)) {
var t, r;
if (e.beta) t = new a(e.beta, 16).toRed(this.red); else {
var i = this._getEndoRoots(this.p);
t = (t = i[0].cmp(i[1]) < 0 ? i[0] : i[1]).toRed(this.red);
}
if (e.lambda) r = new a(e.lambda, 16); else {
var n = this._getEndoRoots(this.n);
if (0 === this.g.mul(n[0]).x.cmp(this.g.x.redMul(t))) r = n[0]; else {
r = n[1];
o(0 === this.g.mul(r).x.cmp(this.g.x.redMul(t)));
}
}
return {
beta: t,
lambda: r,
basis: e.basis ? e.basis.map(function(e) {
return {
a: new a(e.a, 16),
b: new a(e.b, 16)
};
}) : this._getEndoBasis(r)
};
}
};
c.prototype._getEndoRoots = function(e) {
var t = e === this.p ? this.red : a.mont(e), r = new a(2).toRed(t).redInvm(), i = r.redNeg(), n = new a(3).toRed(t).redNeg().redSqrt().redMul(r);
return [ i.redAdd(n).fromRed(), i.redSub(n).fromRed() ];
};
c.prototype._getEndoBasis = function(e) {
for (var t, r, i, n, s, f, o, c, h, d = this.n.ushrn(Math.floor(this.n.bitLength() / 2)), u = e, l = this.n.clone(), p = new a(1), b = new a(0), g = new a(0), m = new a(1), y = 0; 0 !== u.cmpn(0); ) {
var v = l.div(u);
c = l.sub(v.mul(u));
h = g.sub(v.mul(p));
var _ = m.sub(v.mul(b));
if (!i && c.cmp(d) < 0) {
t = o.neg();
r = p;
i = c.neg();
n = h;
} else if (i && 2 == ++y) break;
o = c;
l = u;
u = c;
g = p;
p = h;
m = b;
b = _;
}
s = c.neg();
f = h;
var w = i.sqr().add(n.sqr());
if (s.sqr().add(f.sqr()).cmp(w) >= 0) {
s = t;
f = r;
}
if (i.negative) {
i = i.neg();
n = n.neg();
}
if (s.negative) {
s = s.neg();
f = f.neg();
}
return [ {
a: i,
b: n
}, {
a: s,
b: f
} ];
};
c.prototype._endoSplit = function(e) {
var t = this.endo.basis, r = t[0], i = t[1], n = i.b.mul(e).divRound(this.n), a = r.b.neg().mul(e).divRound(this.n), s = n.mul(r.a), f = a.mul(i.a), o = n.mul(r.b), c = a.mul(i.b);
return {
k1: e.sub(s).sub(f),
k2: o.add(c).neg()
};
};
c.prototype.pointFromX = function(e, t) {
(e = new a(e, 16)).red || (e = e.toRed(this.red));
var r = e.redSqr().redMul(e).redIAdd(e.redMul(this.a)).redIAdd(this.b), i = r.redSqrt();
if (0 !== i.redSqr().redSub(r).cmp(this.zero)) throw new Error("invalid point");
var n = i.fromRed().isOdd();
(t && !n || !t && n) && (i = i.redNeg());
return this.point(e, i);
};
c.prototype.validate = function(e) {
if (e.inf) return !0;
var t = e.x, r = e.y, i = this.a.redMul(t), n = t.redSqr().redMul(t).redIAdd(i).redIAdd(this.b);
return 0 === r.redSqr().redISub(n).cmpn(0);
};
c.prototype._endoWnafMulAdd = function(e, t, r) {
for (var i = this._endoWnafT1, n = this._endoWnafT2, a = 0; a < e.length; a++) {
var s = this._endoSplit(t[a]), f = e[a], o = f._getBeta();
if (s.k1.negative) {
s.k1.ineg();
f = f.neg(!0);
}
if (s.k2.negative) {
s.k2.ineg();
o = o.neg(!0);
}
i[2 * a] = f;
i[2 * a + 1] = o;
n[2 * a] = s.k1;
n[2 * a + 1] = s.k2;
}
for (var c = this._wnafMulAdd(1, i, n, 2 * a, r), h = 0; h < 2 * a; h++) {
i[h] = null;
n[h] = null;
}
return c;
};
function h(e, t, r, i) {
f.BasePoint.call(this, e, "affine");
if (null === t && null === r) {
this.x = null;
this.y = null;
this.inf = !0;
} else {
this.x = new a(t, 16);
this.y = new a(r, 16);
if (i) {
this.x.forceRed(this.curve.red);
this.y.forceRed(this.curve.red);
}
this.x.red || (this.x = this.x.toRed(this.curve.red));
this.y.red || (this.y = this.y.toRed(this.curve.red));
this.inf = !1;
}
}
s(h, f.BasePoint);
c.prototype.point = function(e, t, r) {
return new h(this, e, t, r);
};
c.prototype.pointFromJSON = function(e, t) {
return h.fromJSON(this, e, t);
};
h.prototype._getBeta = function() {
if (this.curve.endo) {
var e = this.precomputed;
if (e && e.beta) return e.beta;
var t = this.curve.point(this.x.redMul(this.curve.endo.beta), this.y);
if (e) {
var r = this.curve, i = function(e) {
return r.point(e.x.redMul(r.endo.beta), e.y);
};
e.beta = t;
t.precomputed = {
beta: null,
naf: e.naf && {
wnd: e.naf.wnd,
points: e.naf.points.map(i)
},
doubles: e.doubles && {
step: e.doubles.step,
points: e.doubles.points.map(i)
}
};
}
return t;
}
};
h.prototype.toJSON = function() {
return this.precomputed ? [ this.x, this.y, this.precomputed && {
doubles: this.precomputed.doubles && {
step: this.precomputed.doubles.step,
points: this.precomputed.doubles.points.slice(1)
},
naf: this.precomputed.naf && {
wnd: this.precomputed.naf.wnd,
points: this.precomputed.naf.points.slice(1)
}
} ] : [ this.x, this.y ];
};
h.fromJSON = function(e, t, r) {
"string" == typeof t && (t = JSON.parse(t));
var i = e.point(t[0], t[1], r);
if (!t[2]) return i;
function n(t) {
return e.point(t[0], t[1], r);
}
var a = t[2];
i.precomputed = {
beta: null,
doubles: a.doubles && {
step: a.doubles.step,
points: [ i ].concat(a.doubles.points.map(n))
},
naf: a.naf && {
wnd: a.naf.wnd,
points: [ i ].concat(a.naf.points.map(n))
}
};
return i;
};
h.prototype.inspect = function() {
return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + ">";
};
h.prototype.isInfinity = function() {
return this.inf;
};
h.prototype.add = function(e) {
if (this.inf) return e;
if (e.inf) return this;
if (this.eq(e)) return this.dbl();
if (this.neg().eq(e)) return this.curve.point(null, null);
if (0 === this.x.cmp(e.x)) return this.curve.point(null, null);
var t = this.y.redSub(e.y);
0 !== t.cmpn(0) && (t = t.redMul(this.x.redSub(e.x).redInvm()));
var r = t.redSqr().redISub(this.x).redISub(e.x), i = t.redMul(this.x.redSub(r)).redISub(this.y);
return this.curve.point(r, i);
};
h.prototype.dbl = function() {
if (this.inf) return this;
var e = this.y.redAdd(this.y);
if (0 === e.cmpn(0)) return this.curve.point(null, null);
var t = this.curve.a, r = this.x.redSqr(), i = e.redInvm(), n = r.redAdd(r).redIAdd(r).redIAdd(t).redMul(i), a = n.redSqr().redISub(this.x.redAdd(this.x)), s = n.redMul(this.x.redSub(a)).redISub(this.y);
return this.curve.point(a, s);
};
h.prototype.getX = function() {
return this.x.fromRed();
};
h.prototype.getY = function() {
return this.y.fromRed();
};
h.prototype.mul = function(e) {
e = new a(e, 16);
return this._hasDoubles(e) ? this.curve._fixedNafMul(this, e) : this.curve.endo ? this.curve._endoWnafMulAdd([ this ], [ e ]) : this.curve._wnafMul(this, e);
};
h.prototype.mulAdd = function(e, t, r) {
var i = [ this, t ], n = [ e, r ];
return this.curve.endo ? this.curve._endoWnafMulAdd(i, n) : this.curve._wnafMulAdd(1, i, n, 2);
};
h.prototype.jmulAdd = function(e, t, r) {
var i = [ this, t ], n = [ e, r ];
return this.curve.endo ? this.curve._endoWnafMulAdd(i, n, !0) : this.curve._wnafMulAdd(1, i, n, 2, !0);
};
h.prototype.eq = function(e) {
return this === e || this.inf === e.inf && (this.inf || 0 === this.x.cmp(e.x) && 0 === this.y.cmp(e.y));
};
h.prototype.neg = function(e) {
if (this.inf) return this;
var t = this.curve.point(this.x, this.y.redNeg());
if (e && this.precomputed) {
var r = this.precomputed, i = function(e) {
return e.neg();
};
t.precomputed = {
naf: r.naf && {
wnd: r.naf.wnd,
points: r.naf.points.map(i)
},
doubles: r.doubles && {
step: r.doubles.step,
points: r.doubles.points.map(i)
}
};
}
return t;
};
h.prototype.toJ = function() {
return this.inf ? this.curve.jpoint(null, null, null) : this.curve.jpoint(this.x, this.y, this.curve.one);
};
function d(e, t, r, i) {
f.BasePoint.call(this, e, "jacobian");
if (null === t && null === r && null === i) {
this.x = this.curve.one;
this.y = this.curve.one;
this.z = new a(0);
} else {
this.x = new a(t, 16);
this.y = new a(r, 16);
this.z = new a(i, 16);
}
this.x.red || (this.x = this.x.toRed(this.curve.red));
this.y.red || (this.y = this.y.toRed(this.curve.red));
this.z.red || (this.z = this.z.toRed(this.curve.red));
this.zOne = this.z === this.curve.one;
}
s(d, f.BasePoint);
c.prototype.jpoint = function(e, t, r) {
return new d(this, e, t, r);
};
d.prototype.toP = function() {
if (this.isInfinity()) return this.curve.point(null, null);
var e = this.z.redInvm(), t = e.redSqr(), r = this.x.redMul(t), i = this.y.redMul(t).redMul(e);
return this.curve.point(r, i);
};
d.prototype.neg = function() {
return this.curve.jpoint(this.x, this.y.redNeg(), this.z);
};
d.prototype.add = function(e) {
if (this.isInfinity()) return e;
if (e.isInfinity()) return this;
var t = e.z.redSqr(), r = this.z.redSqr(), i = this.x.redMul(t), n = e.x.redMul(r), a = this.y.redMul(t.redMul(e.z)), s = e.y.redMul(r.redMul(this.z)), f = i.redSub(n), o = a.redSub(s);
if (0 === f.cmpn(0)) return 0 !== o.cmpn(0) ? this.curve.jpoint(null, null, null) : this.dbl();
var c = f.redSqr(), h = c.redMul(f), d = i.redMul(c), u = o.redSqr().redIAdd(h).redISub(d).redISub(d), l = o.redMul(d.redISub(u)).redISub(a.redMul(h)), p = this.z.redMul(e.z).redMul(f);
return this.curve.jpoint(u, l, p);
};
d.prototype.mixedAdd = function(e) {
if (this.isInfinity()) return e.toJ();
if (e.isInfinity()) return this;
var t = this.z.redSqr(), r = this.x, i = e.x.redMul(t), n = this.y, a = e.y.redMul(t).redMul(this.z), s = r.redSub(i), f = n.redSub(a);
if (0 === s.cmpn(0)) return 0 !== f.cmpn(0) ? this.curve.jpoint(null, null, null) : this.dbl();
var o = s.redSqr(), c = o.redMul(s), h = r.redMul(o), d = f.redSqr().redIAdd(c).redISub(h).redISub(h), u = f.redMul(h.redISub(d)).redISub(n.redMul(c)), l = this.z.redMul(s);
return this.curve.jpoint(d, u, l);
};
d.prototype.dblp = function(e) {
if (0 === e) return this;
if (this.isInfinity()) return this;
if (!e) return this.dbl();
if (this.curve.zeroA || this.curve.threeA) {
for (var t = this, r = 0; r < e; r++) t = t.dbl();
return t;
}
var i = this.curve.a, n = this.curve.tinv, a = this.x, s = this.y, f = this.z, o = f.redSqr().redSqr(), c = s.redAdd(s);
for (r = 0; r < e; r++) {
var h = a.redSqr(), d = c.redSqr(), u = d.redSqr(), l = h.redAdd(h).redIAdd(h).redIAdd(i.redMul(o)), p = a.redMul(d), b = l.redSqr().redISub(p.redAdd(p)), g = p.redISub(b), m = l.redMul(g);
m = m.redIAdd(m).redISub(u);
var y = c.redMul(f);
r + 1 < e && (o = o.redMul(u));
a = b;
f = y;
c = m;
}
return this.curve.jpoint(a, c.redMul(n), f);
};
d.prototype.dbl = function() {
return this.isInfinity() ? this : this.curve.zeroA ? this._zeroDbl() : this.curve.threeA ? this._threeDbl() : this._dbl();
};
d.prototype._zeroDbl = function() {
var e, t, r;
if (this.zOne) {
var i = this.x.redSqr(), n = this.y.redSqr(), a = n.redSqr(), s = this.x.redAdd(n).redSqr().redISub(i).redISub(a);
s = s.redIAdd(s);
var f = i.redAdd(i).redIAdd(i), o = f.redSqr().redISub(s).redISub(s), c = a.redIAdd(a);
c = (c = c.redIAdd(c)).redIAdd(c);
e = o;
t = f.redMul(s.redISub(o)).redISub(c);
r = this.y.redAdd(this.y);
} else {
var h = this.x.redSqr(), d = this.y.redSqr(), u = d.redSqr(), l = this.x.redAdd(d).redSqr().redISub(h).redISub(u);
l = l.redIAdd(l);
var p = h.redAdd(h).redIAdd(h), b = p.redSqr(), g = u.redIAdd(u);
g = (g = g.redIAdd(g)).redIAdd(g);
e = b.redISub(l).redISub(l);
t = p.redMul(l.redISub(e)).redISub(g);
r = (r = this.y.redMul(this.z)).redIAdd(r);
}
return this.curve.jpoint(e, t, r);
};
d.prototype._threeDbl = function() {
var e, t, r;
if (this.zOne) {
var i = this.x.redSqr(), n = this.y.redSqr(), a = n.redSqr(), s = this.x.redAdd(n).redSqr().redISub(i).redISub(a);
s = s.redIAdd(s);
var f = i.redAdd(i).redIAdd(i).redIAdd(this.curve.a), o = f.redSqr().redISub(s).redISub(s);
e = o;
var c = a.redIAdd(a);
c = (c = c.redIAdd(c)).redIAdd(c);
t = f.redMul(s.redISub(o)).redISub(c);
r = this.y.redAdd(this.y);
} else {
var h = this.z.redSqr(), d = this.y.redSqr(), u = this.x.redMul(d), l = this.x.redSub(h).redMul(this.x.redAdd(h));
l = l.redAdd(l).redIAdd(l);
var p = u.redIAdd(u), b = (p = p.redIAdd(p)).redAdd(p);
e = l.redSqr().redISub(b);
r = this.y.redAdd(this.z).redSqr().redISub(d).redISub(h);
var g = d.redSqr();
g = (g = (g = g.redIAdd(g)).redIAdd(g)).redIAdd(g);
t = l.redMul(p.redISub(e)).redISub(g);
}
return this.curve.jpoint(e, t, r);
};
d.prototype._dbl = function() {
var e = this.curve.a, t = this.x, r = this.y, i = this.z, n = i.redSqr().redSqr(), a = t.redSqr(), s = r.redSqr(), f = a.redAdd(a).redIAdd(a).redIAdd(e.redMul(n)), o = t.redAdd(t), c = (o = o.redIAdd(o)).redMul(s), h = f.redSqr().redISub(c.redAdd(c)), d = c.redISub(h), u = s.redSqr();
u = (u = (u = u.redIAdd(u)).redIAdd(u)).redIAdd(u);
var l = f.redMul(d).redISub(u), p = r.redAdd(r).redMul(i);
return this.curve.jpoint(h, l, p);
};
d.prototype.trpl = function() {
if (!this.curve.zeroA) return this.dbl().add(this);
var e = this.x.redSqr(), t = this.y.redSqr(), r = this.z.redSqr(), i = t.redSqr(), n = e.redAdd(e).redIAdd(e), a = n.redSqr(), s = this.x.redAdd(t).redSqr().redISub(e).redISub(i), f = (s = (s = (s = s.redIAdd(s)).redAdd(s).redIAdd(s)).redISub(a)).redSqr(), o = i.redIAdd(i);
o = (o = (o = o.redIAdd(o)).redIAdd(o)).redIAdd(o);
var c = n.redIAdd(s).redSqr().redISub(a).redISub(f).redISub(o), h = t.redMul(c);
h = (h = h.redIAdd(h)).redIAdd(h);
var d = this.x.redMul(f).redISub(h);
d = (d = d.redIAdd(d)).redIAdd(d);
var u = this.y.redMul(c.redMul(o.redISub(c)).redISub(s.redMul(f)));
u = (u = (u = u.redIAdd(u)).redIAdd(u)).redIAdd(u);
var l = this.z.redAdd(s).redSqr().redISub(r).redISub(f);
return this.curve.jpoint(d, u, l);
};
d.prototype.mul = function(e, t) {
e = new a(e, t);
return this.curve._wnafMul(this, e);
};
d.prototype.eq = function(e) {
if ("affine" === e.type) return this.eq(e.toJ());
if (this === e) return !0;
var t = this.z.redSqr(), r = e.z.redSqr();
if (0 !== this.x.redMul(r).redISub(e.x.redMul(t)).cmpn(0)) return !1;
var i = t.redMul(this.z), n = r.redMul(e.z);
return 0 === this.y.redMul(n).redISub(e.y.redMul(i)).cmpn(0);
};
d.prototype.eqXToP = function(e) {
var t = this.z.redSqr(), r = e.toRed(this.curve.red).redMul(t);
if (0 === this.x.cmp(r)) return !0;
for (var i = e.clone(), n = this.curve.redN.redMul(t); ;) {
i.iadd(this.curve.n);
if (i.cmp(this.curve.p) >= 0) return !1;
r.redIAdd(n);
if (0 === this.x.cmp(r)) return !0;
}
};
d.prototype.inspect = function() {
return this.isInfinity() ? "<EC JPoint Infinity>" : "<EC JPoint x: " + this.x.toString(16, 2) + " y: " + this.y.toString(16, 2) + " z: " + this.z.toString(16, 2) + ">";
};
d.prototype.isInfinity = function() {
return 0 === this.z.cmpn(0);
};
}, {
"../../elliptic": 67,
"../curve": 70,
"bn.js": 16,
inherits: 101
} ],
73: [ function(e, t, r) {
"use strict";
var i, n = r, a = e("hash.js"), s = e("../elliptic"), f = s.utils.assert;
function o(e) {
"short" === e.type ? this.curve = new s.curve.short(e) : "edwards" === e.type ? this.curve = new s.curve.edwards(e) : this.curve = new s.curve.mont(e);
this.g = this.curve.g;
this.n = this.curve.n;
this.hash = e.hash;
f(this.g.validate(), "Invalid curve");
f(this.g.mul(this.n).isInfinity(), "Invalid curve, G*N != O");
}
n.PresetCurve = o;
function c(e, t) {
Object.defineProperty(n, e, {
configurable: !0,
enumerable: !0,
get: function() {
var r = new o(t);
Object.defineProperty(n, e, {
configurable: !0,
enumerable: !0,
value: r
});
return r;
}
});
}
c("p192", {
type: "short",
prime: "p192",
p: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff",
a: "ffffffff ffffffff ffffffff fffffffe ffffffff fffffffc",
b: "64210519 e59c80e7 0fa7e9ab 72243049 feb8deec c146b9b1",
n: "ffffffff ffffffff ffffffff 99def836 146bc9b1 b4d22831",
hash: a.sha256,
gRed: !1,
g: [ "188da80e b03090f6 7cbf20eb 43a18800 f4ff0afd 82ff1012", "07192b95 ffc8da78 631011ed 6b24cdd5 73f977a1 1e794811" ]
});
c("p224", {
type: "short",
prime: "p224",
p: "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001",
a: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff fffffffe",
b: "b4050a85 0c04b3ab f5413256 5044b0b7 d7bfd8ba 270b3943 2355ffb4",
n: "ffffffff ffffffff ffffffff ffff16a2 e0b8f03e 13dd2945 5c5c2a3d",
hash: a.sha256,
gRed: !1,
g: [ "b70e0cbd 6bb4bf7f 321390b9 4a03c1d3 56c21122 343280d6 115c1d21", "bd376388 b5f723fb 4c22dfe6 cd4375a0 5a074764 44d58199 85007e34" ]
});
c("p256", {
type: "short",
prime: null,
p: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff ffffffff",
a: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff fffffffc",
b: "5ac635d8 aa3a93e7 b3ebbd55 769886bc 651d06b0 cc53b0f6 3bce3c3e 27d2604b",
n: "ffffffff 00000000 ffffffff ffffffff bce6faad a7179e84 f3b9cac2 fc632551",
hash: a.sha256,
gRed: !1,
g: [ "6b17d1f2 e12c4247 f8bce6e5 63a440f2 77037d81 2deb33a0 f4a13945 d898c296", "4fe342e2 fe1a7f9b 8ee7eb4a 7c0f9e16 2bce3357 6b315ece cbb64068 37bf51f5" ]
});
c("p384", {
type: "short",
prime: null,
p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 ffffffff",
a: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 fffffffc",
b: "b3312fa7 e23ee7e4 988e056b e3f82d19 181d9c6e fe814112 0314088f 5013875a c656398d 8a2ed19d 2a85c8ed d3ec2aef",
n: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff c7634d81 f4372ddf 581a0db2 48b0a77a ecec196a ccc52973",
hash: a.sha384,
gRed: !1,
g: [ "aa87ca22 be8b0537 8eb1c71e f320ad74 6e1d3b62 8ba79b98 59f741e0 82542a38 5502f25d bf55296c 3a545e38 72760ab7", "3617de4a 96262c6f 5d9e98bf 9292dc29 f8f41dbd 289a147c e9da3113 b5f0b8c0 0a60b1ce 1d7e819d 7a431d7c 90ea0e5f" ]
});
c("p521", {
type: "short",
prime: null,
p: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff",
a: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffc",
b: "00000051 953eb961 8e1c9a1f 929a21a0 b68540ee a2da725b 99b315f3 b8b48991 8ef109e1 56193951 ec7e937b 1652c0bd 3bb1bf07 3573df88 3d2c34f1 ef451fd4 6b503f00",
n: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffa 51868783 bf2f966b 7fcc0148 f709a5d0 3bb5c9b8 899c47ae bb6fb71e 91386409",
hash: a.sha512,
gRed: !1,
g: [ "000000c6 858e06b7 0404e9cd 9e3ecb66 2395b442 9c648139 053fb521 f828af60 6b4d3dba a14b5e77 efe75928 fe1dc127 a2ffa8de 3348b3c1 856a429b f97e7e31 c2e5bd66", "00000118 39296a78 9a3bc004 5c8a5fb4 2c7d1bd9 98f54449 579b4468 17afbd17 273e662c 97ee7299 5ef42640 c550b901 3fad0761 353c7086 a272c240 88be9476 9fd16650" ]
});
c("curve25519", {
type: "mont",
prime: "p25519",
p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
a: "76d06",
b: "1",
n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",
hash: a.sha256,
gRed: !1,
g: [ "9" ]
});
c("ed25519", {
type: "edwards",
prime: "p25519",
p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
a: "-1",
c: "1",
d: "52036cee2b6ffe73 8cc740797779e898 00700a4d4141d8ab 75eb4dca135978a3",
n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",
hash: a.sha256,
gRed: !1,
g: [ "216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a", "6666666666666666666666666666666666666666666666666666666666666658" ]
});
try {
i = e("./precomputed/secp256k1");
} catch (e) {
i = void 0;
}
c("secp256k1", {
type: "short",
prime: "k256",
p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f",
a: "0",
b: "7",
n: "ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141",
h: "1",
hash: a.sha256,
beta: "7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee",
lambda: "5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72",
basis: [ {
a: "3086d221a7d46bcde86c90e49284eb15",
b: "-e4437ed6010e88286f547fa90abfe4c3"
}, {
a: "114ca50f7a8e2f3f657c1108d9d44cfd8",
b: "3086d221a7d46bcde86c90e49284eb15"
} ],
gRed: !1,
g: [ "79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798", "483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8", i ]
});
}, {
"../elliptic": 67,
"./precomputed/secp256k1": 80,
"hash.js": 86
} ],
74: [ function(e, t, r) {
"use strict";
var i = e("bn.js"), n = e("hmac-drbg"), a = e("../../elliptic"), s = a.utils.assert, f = e("./key"), o = e("./signature");
function c(e) {
if (!(this instanceof c)) return new c(e);
if ("string" == typeof e) {
s(a.curves.hasOwnProperty(e), "Unknown curve " + e);
e = a.curves[e];
}
e instanceof a.curves.PresetCurve && (e = {
curve: e
});
this.curve = e.curve.curve;
this.n = this.curve.n;
this.nh = this.n.ushrn(1);
this.g = this.curve.g;
this.g = e.curve.g;
this.g.precompute(e.curve.n.bitLength() + 1);
this.hash = e.hash || e.curve.hash;
}
t.exports = c;
c.prototype.keyPair = function(e) {
return new f(this, e);
};
c.prototype.keyFromPrivate = function(e, t) {
return f.fromPrivate(this, e, t);
};
c.prototype.keyFromPublic = function(e, t) {
return f.fromPublic(this, e, t);
};
c.prototype.genKeyPair = function(e) {
e || (e = {});
for (var t = new n({
hash: this.hash,
pers: e.pers,
persEnc: e.persEnc || "utf8",
entropy: e.entropy || a.rand(this.hash.hmacStrength),
entropyEnc: e.entropy && e.entropyEnc || "utf8",
nonce: this.n.toArray()
}), r = this.n.byteLength(), s = this.n.sub(new i(2)); ;) {
var f = new i(t.generate(r));
if (!(f.cmp(s) > 0)) {
f.iaddn(1);
return this.keyFromPrivate(f);
}
}
};
c.prototype._truncateToN = function(e, t) {
var r = 8 * e.byteLength() - this.n.bitLength();
r > 0 && (e = e.ushrn(r));
return !t && e.cmp(this.n) >= 0 ? e.sub(this.n) : e;
};
c.prototype.sign = function(e, t, r, a) {
if ("object" == typeof r) {
a = r;
r = null;
}
a || (a = {});
t = this.keyFromPrivate(t, r);
e = this._truncateToN(new i(e, 16));
for (var s = this.n.byteLength(), f = t.getPrivate().toArray("be", s), c = e.toArray("be", s), h = new n({
hash: this.hash,
entropy: f,
nonce: c,
pers: a.pers,
persEnc: a.persEnc || "utf8"
}), d = this.n.sub(new i(1)), u = 0; ;u++) {
var l = a.k ? a.k(u) : new i(h.generate(this.n.byteLength()));
if (!((l = this._truncateToN(l, !0)).cmpn(1) <= 0 || l.cmp(d) >= 0)) {
var p = this.g.mul(l);
if (!p.isInfinity()) {
var b = p.getX(), g = b.umod(this.n);
if (0 !== g.cmpn(0)) {
var m = l.invm(this.n).mul(g.mul(t.getPrivate()).iadd(e));
if (0 !== (m = m.umod(this.n)).cmpn(0)) {
var y = (p.getY().isOdd() ? 1 : 0) | (0 !== b.cmp(g) ? 2 : 0);
if (a.canonical && m.cmp(this.nh) > 0) {
m = this.n.sub(m);
y ^= 1;
}
return new o({
r: g,
s: m,
recoveryParam: y
});
}
}
}
}
}
};
c.prototype.verify = function(e, t, r, n) {
e = this._truncateToN(new i(e, 16));
r = this.keyFromPublic(r, n);
var a = (t = new o(t, "hex")).r, s = t.s;
if (a.cmpn(1) < 0 || a.cmp(this.n) >= 0) return !1;
if (s.cmpn(1) < 0 || s.cmp(this.n) >= 0) return !1;
var f = s.invm(this.n), c = f.mul(e).umod(this.n), h = f.mul(a).umod(this.n);
if (!this.curve._maxwellTrick) {
var d;
return !(d = this.g.mulAdd(c, r.getPublic(), h)).isInfinity() && 0 === d.getX().umod(this.n).cmp(a);
}
return !(d = this.g.jmulAdd(c, r.getPublic(), h)).isInfinity() && d.eqXToP(a);
};
c.prototype.recoverPubKey = function(e, t, r, n) {
s((3 & r) === r, "The recovery param is more than two bits");
t = new o(t, n);
var a = this.n, f = new i(e), c = t.r, h = t.s, d = 1 & r, u = r >> 1;
if (c.cmp(this.curve.p.umod(this.curve.n)) >= 0 && u) throw new Error("Unable to find sencond key candinate");
c = u ? this.curve.pointFromX(c.add(this.curve.n), d) : this.curve.pointFromX(c, d);
var l = t.r.invm(a), p = a.sub(f).mul(l).umod(a), b = h.mul(l).umod(a);
return this.g.mulAdd(p, c, b);
};
c.prototype.getKeyRecoveryParam = function(e, t, r, i) {
if (null !== (t = new o(t, i)).recoveryParam) return t.recoveryParam;
for (var n = 0; n < 4; n++) {
var a;
try {
a = this.recoverPubKey(e, t, n);
} catch (e) {
continue;
}
if (a.eq(r)) return n;
}
throw new Error("Unable to find valid recovery factor");
};
}, {
"../../elliptic": 67,
"./key": 75,
"./signature": 76,
"bn.js": 16,
"hmac-drbg": 98
} ],
75: [ function(e, t, r) {
"use strict";
var i = e("bn.js"), n = e("../../elliptic").utils.assert;
function a(e, t) {
this.ec = e;
this.priv = null;
this.pub = null;
t.priv && this._importPrivate(t.priv, t.privEnc);
t.pub && this._importPublic(t.pub, t.pubEnc);
}
t.exports = a;
a.fromPublic = function(e, t, r) {
return t instanceof a ? t : new a(e, {
pub: t,
pubEnc: r
});
};
a.fromPrivate = function(e, t, r) {
return t instanceof a ? t : new a(e, {
priv: t,
privEnc: r
});
};
a.prototype.validate = function() {
var e = this.getPublic();
return e.isInfinity() ? {
result: !1,
reason: "Invalid public key"
} : e.validate() ? e.mul(this.ec.curve.n).isInfinity() ? {
result: !0,
reason: null
} : {
result: !1,
reason: "Public key * N != O"
} : {
result: !1,
reason: "Public key is not a point"
};
};
a.prototype.getPublic = function(e, t) {
if ("string" == typeof e) {
t = e;
e = null;
}
this.pub || (this.pub = this.ec.g.mul(this.priv));
return t ? this.pub.encode(t, e) : this.pub;
};
a.prototype.getPrivate = function(e) {
return "hex" === e ? this.priv.toString(16, 2) : this.priv;
};
a.prototype._importPrivate = function(e, t) {
this.priv = new i(e, t || 16);
this.priv = this.priv.umod(this.ec.curve.n);
};
a.prototype._importPublic = function(e, t) {
if (e.x || e.y) {
"mont" === this.ec.curve.type ? n(e.x, "Need x coordinate") : "short" !== this.ec.curve.type && "edwards" !== this.ec.curve.type || n(e.x && e.y, "Need both x and y coordinate");
this.pub = this.ec.curve.point(e.x, e.y);
} else this.pub = this.ec.curve.decodePoint(e, t);
};
a.prototype.derive = function(e) {
return e.mul(this.priv).getX();
};
a.prototype.sign = function(e, t, r) {
return this.ec.sign(e, this, t, r);
};
a.prototype.verify = function(e, t) {
return this.ec.verify(e, t, this);
};
a.prototype.inspect = function() {
return "<Key priv: " + (this.priv && this.priv.toString(16, 2)) + " pub: " + (this.pub && this.pub.inspect()) + " >";
};
}, {
"../../elliptic": 67,
"bn.js": 16
} ],
76: [ function(e, t, r) {
"use strict";
var i = e("bn.js"), n = e("../../elliptic").utils, a = n.assert;
function s(e, t) {
if (e instanceof s) return e;
if (!this._importDER(e, t)) {
a(e.r && e.s, "Signature without r or s");
this.r = new i(e.r, 16);
this.s = new i(e.s, 16);
void 0 === e.recoveryParam ? this.recoveryParam = null : this.recoveryParam = e.recoveryParam;
}
}
t.exports = s;
function f(e, t) {
var r = e[t.place++];
if (!(128 & r)) return r;
for (var i = 15 & r, n = 0, a = 0, s = t.place; a < i; a++, s++) {
n <<= 8;
n |= e[s];
}
t.place = s;
return n;
}
function o(e) {
for (var t = 0, r = e.length - 1; !e[t] && !(128 & e[t + 1]) && t < r; ) t++;
return 0 === t ? e : e.slice(t);
}
s.prototype._importDER = function(e, t) {
e = n.toArray(e, t);
var r = new function() {
this.place = 0;
}();
if (48 !== e[r.place++]) return !1;
if (f(e, r) + r.place !== e.length) return !1;
if (2 !== e[r.place++]) return !1;
var a = f(e, r), s = e.slice(r.place, a + r.place);
r.place += a;
if (2 !== e[r.place++]) return !1;
var o = f(e, r);
if (e.length !== o + r.place) return !1;
var c = e.slice(r.place, o + r.place);
0 === s[0] && 128 & s[1] && (s = s.slice(1));
0 === c[0] && 128 & c[1] && (c = c.slice(1));
this.r = new i(s);
this.s = new i(c);
this.recoveryParam = null;
return !0;
};
function c(e, t) {
if (t < 128) e.push(t); else {
var r = 1 + (Math.log(t) / Math.LN2 >>> 3);
e.push(128 | r);
for (;--r; ) e.push(t >>> (r << 3) & 255);
e.push(t);
}
}
s.prototype.toDER = function(e) {
var t = this.r.toArray(), r = this.s.toArray();
128 & t[0] && (t = [ 0 ].concat(t));
128 & r[0] && (r = [ 0 ].concat(r));
t = o(t);
r = o(r);
for (;!(r[0] || 128 & r[1]); ) r = r.slice(1);
var i = [ 2 ];
c(i, t.length);
(i = i.concat(t)).push(2);
c(i, r.length);
var a = i.concat(r), s = [ 48 ];
c(s, a.length);
s = s.concat(a);
return n.encode(s, e);
};
}, {
"../../elliptic": 67,
"bn.js": 16
} ],
77: [ function(e, t, r) {
"use strict";
var i = e("hash.js"), n = e("../../elliptic"), a = n.utils, s = a.assert, f = a.parseBytes, o = e("./key"), c = e("./signature");
function h(e) {
s("ed25519" === e, "only tested with ed25519 so far");
if (!(this instanceof h)) return new h(e);
e = n.curves[e].curve;
this.curve = e;
this.g = e.g;
this.g.precompute(e.n.bitLength() + 1);
this.pointClass = e.point().constructor;
this.encodingLength = Math.ceil(e.n.bitLength() / 8);
this.hash = i.sha512;
}
t.exports = h;
h.prototype.sign = function(e, t) {
e = f(e);
var r = this.keyFromSecret(t), i = this.hashInt(r.messagePrefix(), e), n = this.g.mul(i), a = this.encodePoint(n), s = this.hashInt(a, r.pubBytes(), e).mul(r.priv()), o = i.add(s).umod(this.curve.n);
return this.makeSignature({
R: n,
S: o,
Rencoded: a
});
};
h.prototype.verify = function(e, t, r) {
e = f(e);
t = this.makeSignature(t);
var i = this.keyFromPublic(r), n = this.hashInt(t.Rencoded(), i.pubBytes(), e), a = this.g.mul(t.S());
return t.R().add(i.pub().mul(n)).eq(a);
};
h.prototype.hashInt = function() {
for (var e = this.hash(), t = 0; t < arguments.length; t++) e.update(arguments[t]);
return a.intFromLE(e.digest()).umod(this.curve.n);
};
h.prototype.keyFromPublic = function(e) {
return o.fromPublic(this, e);
};
h.prototype.keyFromSecret = function(e) {
return o.fromSecret(this, e);
};
h.prototype.makeSignature = function(e) {
return e instanceof c ? e : new c(this, e);
};
h.prototype.encodePoint = function(e) {
var t = e.getY().toArray("le", this.encodingLength);
t[this.encodingLength - 1] |= e.getX().isOdd() ? 128 : 0;
return t;
};
h.prototype.decodePoint = function(e) {
var t = (e = a.parseBytes(e)).length - 1, r = e.slice(0, t).concat(-129 & e[t]), i = 0 != (128 & e[t]), n = a.intFromLE(r);
return this.curve.pointFromY(n, i);
};
h.prototype.encodeInt = function(e) {
return e.toArray("le", this.encodingLength);
};
h.prototype.decodeInt = function(e) {
return a.intFromLE(e);
};
h.prototype.isPoint = function(e) {
return e instanceof this.pointClass;
};
}, {
"../../elliptic": 67,
"./key": 78,
"./signature": 79,
"hash.js": 86
} ],
78: [ function(e, t, r) {
"use strict";
var i = e("../../elliptic").utils, n = i.assert, a = i.parseBytes, s = i.cachedProperty;
function f(e, t) {
this.eddsa = e;
this._secret = a(t.secret);
e.isPoint(t.pub) ? this._pub = t.pub : this._pubBytes = a(t.pub);
}
f.fromPublic = function(e, t) {
return t instanceof f ? t : new f(e, {
pub: t
});
};
f.fromSecret = function(e, t) {
return t instanceof f ? t : new f(e, {
secret: t
});
};
f.prototype.secret = function() {
return this._secret;
};
s(f, "pubBytes", function() {
return this.eddsa.encodePoint(this.pub());
});
s(f, "pub", function() {
return this._pubBytes ? this.eddsa.decodePoint(this._pubBytes) : this.eddsa.g.mul(this.priv());
});
s(f, "privBytes", function() {
var e = this.eddsa, t = this.hash(), r = e.encodingLength - 1, i = t.slice(0, e.encodingLength);
i[0] &= 248;
i[r] &= 127;
i[r] |= 64;
return i;
});
s(f, "priv", function() {
return this.eddsa.decodeInt(this.privBytes());
});
s(f, "hash", function() {
return this.eddsa.hash().update(this.secret()).digest();
});
s(f, "messagePrefix", function() {
return this.hash().slice(this.eddsa.encodingLength);
});
f.prototype.sign = function(e) {
n(this._secret, "KeyPair can only verify");
return this.eddsa.sign(e, this);
};
f.prototype.verify = function(e, t) {
return this.eddsa.verify(e, t, this);
};
f.prototype.getSecret = function(e) {
n(this._secret, "KeyPair is public only");
return i.encode(this.secret(), e);
};
f.prototype.getPublic = function(e) {
return i.encode(this.pubBytes(), e);
};
t.exports = f;
}, {
"../../elliptic": 67
} ],
79: [ function(e, t, r) {
"use strict";
var i = e("bn.js"), n = e("../../elliptic").utils, a = n.assert, s = n.cachedProperty, f = n.parseBytes;
function o(e, t) {
this.eddsa = e;
"object" != typeof t && (t = f(t));
Array.isArray(t) && (t = {
R: t.slice(0, e.encodingLength),
S: t.slice(e.encodingLength)
});
a(t.R && t.S, "Signature without R or S");
e.isPoint(t.R) && (this._R = t.R);
t.S instanceof i && (this._S = t.S);
this._Rencoded = Array.isArray(t.R) ? t.R : t.Rencoded;
this._Sencoded = Array.isArray(t.S) ? t.S : t.Sencoded;
}
s(o, "S", function() {
return this.eddsa.decodeInt(this.Sencoded());
});
s(o, "R", function() {
return this.eddsa.decodePoint(this.Rencoded());
});
s(o, "Rencoded", function() {
return this.eddsa.encodePoint(this.R());
});
s(o, "Sencoded", function() {
return this.eddsa.encodeInt(this.S());
});
o.prototype.toBytes = function() {
return this.Rencoded().concat(this.Sencoded());
};
o.prototype.toHex = function() {
return n.encode(this.toBytes(), "hex").toUpperCase();
};
t.exports = o;
}, {
"../../elliptic": 67,
"bn.js": 16
} ],
80: [ function(e, t, r) {
t.exports = {
doubles: {
step: 4,
points: [ [ "e60fce93b59e9ec53011aabc21c23e97b2a31369b87a5ae9c44ee89e2a6dec0a", "f7e3507399e595929db99f34f57937101296891e44d23f0be1f32cce69616821" ], [ "8282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508", "11f8a8098557dfe45e8256e830b60ace62d613ac2f7b17bed31b6eaff6e26caf" ], [ "175e159f728b865a72f99cc6c6fc846de0b93833fd2222ed73fce5b551e5b739", "d3506e0d9e3c79eba4ef97a51ff71f5eacb5955add24345c6efa6ffee9fed695" ], [ "363d90d447b00c9c99ceac05b6262ee053441c7e55552ffe526bad8f83ff4640", "4e273adfc732221953b445397f3363145b9a89008199ecb62003c7f3bee9de9" ], [ "8b4b5f165df3c2be8c6244b5b745638843e4a781a15bcd1b69f79a55dffdf80c", "4aad0a6f68d308b4b3fbd7813ab0da04f9e336546162ee56b3eff0c65fd4fd36" ], [ "723cbaa6e5db996d6bf771c00bd548c7b700dbffa6c0e77bcb6115925232fcda", "96e867b5595cc498a921137488824d6e2660a0653779494801dc069d9eb39f5f" ], [ "eebfa4d493bebf98ba5feec812c2d3b50947961237a919839a533eca0e7dd7fa", "5d9a8ca3970ef0f269ee7edaf178089d9ae4cdc3a711f712ddfd4fdae1de8999" ], [ "100f44da696e71672791d0a09b7bde459f1215a29b3c03bfefd7835b39a48db0", "cdd9e13192a00b772ec8f3300c090666b7ff4a18ff5195ac0fbd5cd62bc65a09" ], [ "e1031be262c7ed1b1dc9227a4a04c017a77f8d4464f3b3852c8acde6e534fd2d", "9d7061928940405e6bb6a4176597535af292dd419e1ced79a44f18f29456a00d" ], [ "feea6cae46d55b530ac2839f143bd7ec5cf8b266a41d6af52d5e688d9094696d", "e57c6b6c97dce1bab06e4e12bf3ecd5c981c8957cc41442d3155debf18090088" ], [ "da67a91d91049cdcb367be4be6ffca3cfeed657d808583de33fa978bc1ec6cb1", "9bacaa35481642bc41f463f7ec9780e5dec7adc508f740a17e9ea8e27a68be1d" ], [ "53904faa0b334cdda6e000935ef22151ec08d0f7bb11069f57545ccc1a37b7c0", "5bc087d0bc80106d88c9eccac20d3c1c13999981e14434699dcb096b022771c8" ], [ "8e7bcd0bd35983a7719cca7764ca906779b53a043a9b8bcaeff959f43ad86047", "10b7770b2a3da4b3940310420ca9514579e88e2e47fd68b3ea10047e8460372a" ], [ "385eed34c1cdff21e6d0818689b81bde71a7f4f18397e6690a841e1599c43862", "283bebc3e8ea23f56701de19e9ebf4576b304eec2086dc8cc0458fe5542e5453" ], [ "6f9d9b803ecf191637c73a4413dfa180fddf84a5947fbc9c606ed86c3fac3a7", "7c80c68e603059ba69b8e2a30e45c4d47ea4dd2f5c281002d86890603a842160" ], [ "3322d401243c4e2582a2147c104d6ecbf774d163db0f5e5313b7e0e742d0e6bd", "56e70797e9664ef5bfb019bc4ddaf9b72805f63ea2873af624f3a2e96c28b2a0" ], [ "85672c7d2de0b7da2bd1770d89665868741b3f9af7643397721d74d28134ab83", "7c481b9b5b43b2eb6374049bfa62c2e5e77f17fcc5298f44c8e3094f790313a6" ], [ "948bf809b1988a46b06c9f1919413b10f9226c60f668832ffd959af60c82a0a", "53a562856dcb6646dc6b74c5d1c3418c6d4dff08c97cd2bed4cb7f88d8c8e589" ], [ "6260ce7f461801c34f067ce0f02873a8f1b0e44dfc69752accecd819f38fd8e8", "bc2da82b6fa5b571a7f09049776a1ef7ecd292238051c198c1a84e95b2b4ae17" ], [ "e5037de0afc1d8d43d8348414bbf4103043ec8f575bfdc432953cc8d2037fa2d", "4571534baa94d3b5f9f98d09fb990bddbd5f5b03ec481f10e0e5dc841d755bda" ], [ "e06372b0f4a207adf5ea905e8f1771b4e7e8dbd1c6a6c5b725866a0ae4fce725", "7a908974bce18cfe12a27bb2ad5a488cd7484a7787104870b27034f94eee31dd" ], [ "213c7a715cd5d45358d0bbf9dc0ce02204b10bdde2a3f58540ad6908d0559754", "4b6dad0b5ae462507013ad06245ba190bb4850f5f36a7eeddff2c27534b458f2" ], [ "4e7c272a7af4b34e8dbb9352a5419a87e2838c70adc62cddf0cc3a3b08fbd53c", "17749c766c9d0b18e16fd09f6def681b530b9614bff7dd33e0b3941817dcaae6" ], [ "fea74e3dbe778b1b10f238ad61686aa5c76e3db2be43057632427e2840fb27b6", "6e0568db9b0b13297cf674deccb6af93126b596b973f7b77701d3db7f23cb96f" ], [ "76e64113f677cf0e10a2570d599968d31544e179b760432952c02a4417bdde39", "c90ddf8dee4e95cf577066d70681f0d35e2a33d2b56d2032b4b1752d1901ac01" ], [ "c738c56b03b2abe1e8281baa743f8f9a8f7cc643df26cbee3ab150242bcbb891", "893fb578951ad2537f718f2eacbfbbbb82314eef7880cfe917e735d9699a84c3" ], [ "d895626548b65b81e264c7637c972877d1d72e5f3a925014372e9f6588f6c14b", "febfaa38f2bc7eae728ec60818c340eb03428d632bb067e179363ed75d7d991f" ], [ "b8da94032a957518eb0f6433571e8761ceffc73693e84edd49150a564f676e03", "2804dfa44805a1e4d7c99cc9762808b092cc584d95ff3b511488e4e74efdf6e7" ], [ "e80fea14441fb33a7d8adab9475d7fab2019effb5156a792f1a11778e3c0df5d", "eed1de7f638e00771e89768ca3ca94472d155e80af322ea9fcb4291b6ac9ec78" ], [ "a301697bdfcd704313ba48e51d567543f2a182031efd6915ddc07bbcc4e16070", "7370f91cfb67e4f5081809fa25d40f9b1735dbf7c0a11a130c0d1a041e177ea1" ], [ "90ad85b389d6b936463f9d0512678de208cc330b11307fffab7ac63e3fb04ed4", "e507a3620a38261affdcbd9427222b839aefabe1582894d991d4d48cb6ef150" ], [ "8f68b9d2f63b5f339239c1ad981f162ee88c5678723ea3351b7b444c9ec4c0da", "662a9f2dba063986de1d90c2b6be215dbbea2cfe95510bfdf23cbf79501fff82" ], [ "e4f3fb0176af85d65ff99ff9198c36091f48e86503681e3e6686fd5053231e11", "1e63633ad0ef4f1c1661a6d0ea02b7286cc7e74ec951d1c9822c38576feb73bc" ], [ "8c00fa9b18ebf331eb961537a45a4266c7034f2f0d4e1d0716fb6eae20eae29e", "efa47267fea521a1a9dc343a3736c974c2fadafa81e36c54e7d2a4c66702414b" ], [ "e7a26ce69dd4829f3e10cec0a9e98ed3143d084f308b92c0997fddfc60cb3e41", "2a758e300fa7984b471b006a1aafbb18d0a6b2c0420e83e20e8a9421cf2cfd51" ], [ "b6459e0ee3662ec8d23540c223bcbdc571cbcb967d79424f3cf29eb3de6b80ef", "67c876d06f3e06de1dadf16e5661db3c4b3ae6d48e35b2ff30bf0b61a71ba45" ], [ "d68a80c8280bb840793234aa118f06231d6f1fc67e73c5a5deda0f5b496943e8", "db8ba9fff4b586d00c4b1f9177b0e28b5b0e7b8f7845295a294c84266b133120" ], [ "324aed7df65c804252dc0270907a30b09612aeb973449cea4095980fc28d3d5d", "648a365774b61f2ff130c0c35aec1f4f19213b0c7e332843967224af96ab7c84" ], [ "4df9c14919cde61f6d51dfdbe5fee5dceec4143ba8d1ca888e8bd373fd054c96", "35ec51092d8728050974c23a1d85d4b5d506cdc288490192ebac06cad10d5d" ], [ "9c3919a84a474870faed8a9c1cc66021523489054d7f0308cbfc99c8ac1f98cd", "ddb84f0f4a4ddd57584f044bf260e641905326f76c64c8e6be7e5e03d4fc599d" ], [ "6057170b1dd12fdf8de05f281d8e06bb91e1493a8b91d4cc5a21382120a959e5", "9a1af0b26a6a4807add9a2daf71df262465152bc3ee24c65e899be932385a2a8" ], [ "a576df8e23a08411421439a4518da31880cef0fba7d4df12b1a6973eecb94266", "40a6bf20e76640b2c92b97afe58cd82c432e10a7f514d9f3ee8be11ae1b28ec8" ], [ "7778a78c28dec3e30a05fe9629de8c38bb30d1f5cf9a3a208f763889be58ad71", "34626d9ab5a5b22ff7098e12f2ff580087b38411ff24ac563b513fc1fd9f43ac" ], [ "928955ee637a84463729fd30e7afd2ed5f96274e5ad7e5cb09eda9c06d903ac", "c25621003d3f42a827b78a13093a95eeac3d26efa8a8d83fc5180e935bcd091f" ], [ "85d0fef3ec6db109399064f3a0e3b2855645b4a907ad354527aae75163d82751", "1f03648413a38c0be29d496e582cf5663e8751e96877331582c237a24eb1f962" ], [ "ff2b0dce97eece97c1c9b6041798b85dfdfb6d8882da20308f5404824526087e", "493d13fef524ba188af4c4dc54d07936c7b7ed6fb90e2ceb2c951e01f0c29907" ], [ "827fbbe4b1e880ea9ed2b2e6301b212b57f1ee148cd6dd28780e5e2cf856e241", "c60f9c923c727b0b71bef2c67d1d12687ff7a63186903166d605b68baec293ec" ], [ "eaa649f21f51bdbae7be4ae34ce6e5217a58fdce7f47f9aa7f3b58fa2120e2b3", "be3279ed5bbbb03ac69a80f89879aa5a01a6b965f13f7e59d47a5305ba5ad93d" ], [ "e4a42d43c5cf169d9391df6decf42ee541b6d8f0c9a137401e23632dda34d24f", "4d9f92e716d1c73526fc99ccfb8ad34ce886eedfa8d8e4f13a7f7131deba9414" ], [ "1ec80fef360cbdd954160fadab352b6b92b53576a88fea4947173b9d4300bf19", "aeefe93756b5340d2f3a4958a7abbf5e0146e77f6295a07b671cdc1cc107cefd" ], [ "146a778c04670c2f91b00af4680dfa8bce3490717d58ba889ddb5928366642be", "b318e0ec3354028add669827f9d4b2870aaa971d2f7e5ed1d0b297483d83efd0" ], [ "fa50c0f61d22e5f07e3acebb1aa07b128d0012209a28b9776d76a8793180eef9", "6b84c6922397eba9b72cd2872281a68a5e683293a57a213b38cd8d7d3f4f2811" ], [ "da1d61d0ca721a11b1a5bf6b7d88e8421a288ab5d5bba5220e53d32b5f067ec2", "8157f55a7c99306c79c0766161c91e2966a73899d279b48a655fba0f1ad836f1" ], [ "a8e282ff0c9706907215ff98e8fd416615311de0446f1e062a73b0610d064e13", "7f97355b8db81c09abfb7f3c5b2515888b679a3e50dd6bd6cef7c73111f4cc0c" ], [ "174a53b9c9a285872d39e56e6913cab15d59b1fa512508c022f382de8319497c", "ccc9dc37abfc9c1657b4155f2c47f9e6646b3a1d8cb9854383da13ac079afa73" ], [ "959396981943785c3d3e57edf5018cdbe039e730e4918b3d884fdff09475b7ba", "2e7e552888c331dd8ba0386a4b9cd6849c653f64c8709385e9b8abf87524f2fd" ], [ "d2a63a50ae401e56d645a1153b109a8fcca0a43d561fba2dbb51340c9d82b151", "e82d86fb6443fcb7565aee58b2948220a70f750af484ca52d4142174dcf89405" ], [ "64587e2335471eb890ee7896d7cfdc866bacbdbd3839317b3436f9b45617e073", "d99fcdd5bf6902e2ae96dd6447c299a185b90a39133aeab358299e5e9faf6589" ], [ "8481bde0e4e4d885b3a546d3e549de042f0aa6cea250e7fd358d6c86dd45e458", "38ee7b8cba5404dd84a25bf39cecb2ca900a79c42b262e556d64b1b59779057e" ], [ "13464a57a78102aa62b6979ae817f4637ffcfed3c4b1ce30bcd6303f6caf666b", "69be159004614580ef7e433453ccb0ca48f300a81d0942e13f495a907f6ecc27" ], [ "bc4a9df5b713fe2e9aef430bcc1dc97a0cd9ccede2f28588cada3a0d2d83f366", "d3a81ca6e785c06383937adf4b798caa6e8a9fbfa547b16d758d666581f33c1" ], [ "8c28a97bf8298bc0d23d8c749452a32e694b65e30a9472a3954ab30fe5324caa", "40a30463a3305193378fedf31f7cc0eb7ae784f0451cb9459e71dc73cbef9482" ], [ "8ea9666139527a8c1dd94ce4f071fd23c8b350c5a4bb33748c4ba111faccae0", "620efabbc8ee2782e24e7c0cfb95c5d735b783be9cf0f8e955af34a30e62b945" ], [ "dd3625faef5ba06074669716bbd3788d89bdde815959968092f76cc4eb9a9787", "7a188fa3520e30d461da2501045731ca941461982883395937f68d00c644a573" ], [ "f710d79d9eb962297e4f6232b40e8f7feb2bc63814614d692c12de752408221e", "ea98e67232d3b3295d3b535532115ccac8612c721851617526ae47a9c77bfc82" ] ]
},
naf: {
wnd: 7,
points: [ [ "f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9", "388f7b0f632de8140fe337e62a37f3566500a99934c2231b6cb9fd7584b8e672" ], [ "2f8bde4d1a07209355b4a7250a5c5128e88b84bddc619ab7cba8d569b240efe4", "d8ac222636e5e3d6d4dba9dda6c9c426f788271bab0d6840dca87d3aa6ac62d6" ], [ "5cbdf0646e5db4eaa398f365f2ea7a0e3d419b7e0330e39ce92bddedcac4f9bc", "6aebca40ba255960a3178d6d861a54dba813d0b813fde7b5a5082628087264da" ], [ "acd484e2f0c7f65309ad178a9f559abde09796974c57e714c35f110dfc27ccbe", "cc338921b0a7d9fd64380971763b61e9add888a4375f8e0f05cc262ac64f9c37" ], [ "774ae7f858a9411e5ef4246b70c65aac5649980be5c17891bbec17895da008cb", "d984a032eb6b5e190243dd56d7b7b365372db1e2dff9d6a8301d74c9c953c61b" ], [ "f28773c2d975288bc7d1d205c3748651b075fbc6610e58cddeeddf8f19405aa8", "ab0902e8d880a89758212eb65cdaf473a1a06da521fa91f29b5cb52db03ed81" ], [ "d7924d4f7d43ea965a465ae3095ff41131e5946f3c85f79e44adbcf8e27e080e", "581e2872a86c72a683842ec228cc6defea40af2bd896d3a5c504dc9ff6a26b58" ], [ "defdea4cdb677750a420fee807eacf21eb9898ae79b9768766e4faa04a2d4a34", "4211ab0694635168e997b0ead2a93daeced1f4a04a95c0f6cfb199f69e56eb77" ], [ "2b4ea0a797a443d293ef5cff444f4979f06acfebd7e86d277475656138385b6c", "85e89bc037945d93b343083b5a1c86131a01f60c50269763b570c854e5c09b7a" ], [ "352bbf4a4cdd12564f93fa332ce333301d9ad40271f8107181340aef25be59d5", "321eb4075348f534d59c18259dda3e1f4a1b3b2e71b1039c67bd3d8bcf81998c" ], [ "2fa2104d6b38d11b0230010559879124e42ab8dfeff5ff29dc9cdadd4ecacc3f", "2de1068295dd865b64569335bd5dd80181d70ecfc882648423ba76b532b7d67" ], [ "9248279b09b4d68dab21a9b066edda83263c3d84e09572e269ca0cd7f5453714", "73016f7bf234aade5d1aa71bdea2b1ff3fc0de2a887912ffe54a32ce97cb3402" ], [ "daed4f2be3a8bf278e70132fb0beb7522f570e144bf615c07e996d443dee8729", "a69dce4a7d6c98e8d4a1aca87ef8d7003f83c230f3afa726ab40e52290be1c55" ], [ "c44d12c7065d812e8acf28d7cbb19f9011ecd9e9fdf281b0e6a3b5e87d22e7db", "2119a460ce326cdc76c45926c982fdac0e106e861edf61c5a039063f0e0e6482" ], [ "6a245bf6dc698504c89a20cfded60853152b695336c28063b61c65cbd269e6b4", "e022cf42c2bd4a708b3f5126f16a24ad8b33ba48d0423b6efd5e6348100d8a82" ], [ "1697ffa6fd9de627c077e3d2fe541084ce13300b0bec1146f95ae57f0d0bd6a5", "b9c398f186806f5d27561506e4557433a2cf15009e498ae7adee9d63d01b2396" ], [ "605bdb019981718b986d0f07e834cb0d9deb8360ffb7f61df982345ef27a7479", "2972d2de4f8d20681a78d93ec96fe23c26bfae84fb14db43b01e1e9056b8c49" ], [ "62d14dab4150bf497402fdc45a215e10dcb01c354959b10cfe31c7e9d87ff33d", "80fc06bd8cc5b01098088a1950eed0db01aa132967ab472235f5642483b25eaf" ], [ "80c60ad0040f27dade5b4b06c408e56b2c50e9f56b9b8b425e555c2f86308b6f", "1c38303f1cc5c30f26e66bad7fe72f70a65eed4cbe7024eb1aa01f56430bd57a" ], [ "7a9375ad6167ad54aa74c6348cc54d344cc5dc9487d847049d5eabb0fa03c8fb", "d0e3fa9eca8726909559e0d79269046bdc59ea10c70ce2b02d499ec224dc7f7" ], [ "d528ecd9b696b54c907a9ed045447a79bb408ec39b68df504bb51f459bc3ffc9", "eecf41253136e5f99966f21881fd656ebc4345405c520dbc063465b521409933" ], [ "49370a4b5f43412ea25f514e8ecdad05266115e4a7ecb1387231808f8b45963", "758f3f41afd6ed428b3081b0512fd62a54c3f3afbb5b6764b653052a12949c9a" ], [ "77f230936ee88cbbd73df930d64702ef881d811e0e1498e2f1c13eb1fc345d74", "958ef42a7886b6400a08266e9ba1b37896c95330d97077cbbe8eb3c7671c60d6" ], [ "f2dac991cc4ce4b9ea44887e5c7c0bce58c80074ab9d4dbaeb28531b7739f530", "e0dedc9b3b2f8dad4da1f32dec2531df9eb5fbeb0598e4fd1a117dba703a3c37" ], [ "463b3d9f662621fb1b4be8fbbe2520125a216cdfc9dae3debcba4850c690d45b", "5ed430d78c296c3543114306dd8622d7c622e27c970a1de31cb377b01af7307e" ], [ "f16f804244e46e2a09232d4aff3b59976b98fac14328a2d1a32496b49998f247", "cedabd9b82203f7e13d206fcdf4e33d92a6c53c26e5cce26d6579962c4e31df6" ], [ "caf754272dc84563b0352b7a14311af55d245315ace27c65369e15f7151d41d1", "cb474660ef35f5f2a41b643fa5e460575f4fa9b7962232a5c32f908318a04476" ], [ "2600ca4b282cb986f85d0f1709979d8b44a09c07cb86d7c124497bc86f082120", "4119b88753c15bd6a693b03fcddbb45d5ac6be74ab5f0ef44b0be9475a7e4b40" ], [ "7635ca72d7e8432c338ec53cd12220bc01c48685e24f7dc8c602a7746998e435", "91b649609489d613d1d5e590f78e6d74ecfc061d57048bad9e76f302c5b9c61" ], [ "754e3239f325570cdbbf4a87deee8a66b7f2b33479d468fbc1a50743bf56cc18", "673fb86e5bda30fb3cd0ed304ea49a023ee33d0197a695d0c5d98093c536683" ], [ "e3e6bd1071a1e96aff57859c82d570f0330800661d1c952f9fe2694691d9b9e8", "59c9e0bba394e76f40c0aa58379a3cb6a5a2283993e90c4167002af4920e37f5" ], [ "186b483d056a033826ae73d88f732985c4ccb1f32ba35f4b4cc47fdcf04aa6eb", "3b952d32c67cf77e2e17446e204180ab21fb8090895138b4a4a797f86e80888b" ], [ "df9d70a6b9876ce544c98561f4be4f725442e6d2b737d9c91a8321724ce0963f", "55eb2dafd84d6ccd5f862b785dc39d4ab157222720ef9da217b8c45cf2ba2417" ], [ "5edd5cc23c51e87a497ca815d5dce0f8ab52554f849ed8995de64c5f34ce7143", "efae9c8dbc14130661e8cec030c89ad0c13c66c0d17a2905cdc706ab7399a868" ], [ "290798c2b6476830da12fe02287e9e777aa3fba1c355b17a722d362f84614fba", "e38da76dcd440621988d00bcf79af25d5b29c094db2a23146d003afd41943e7a" ], [ "af3c423a95d9f5b3054754efa150ac39cd29552fe360257362dfdecef4053b45", "f98a3fd831eb2b749a93b0e6f35cfb40c8cd5aa667a15581bc2feded498fd9c6" ], [ "766dbb24d134e745cccaa28c99bf274906bb66b26dcf98df8d2fed50d884249a", "744b1152eacbe5e38dcc887980da38b897584a65fa06cedd2c924f97cbac5996" ], [ "59dbf46f8c94759ba21277c33784f41645f7b44f6c596a58ce92e666191abe3e", "c534ad44175fbc300f4ea6ce648309a042ce739a7919798cd85e216c4a307f6e" ], [ "f13ada95103c4537305e691e74e9a4a8dd647e711a95e73cb62dc6018cfd87b8", "e13817b44ee14de663bf4bc808341f326949e21a6a75c2570778419bdaf5733d" ], [ "7754b4fa0e8aced06d4167a2c59cca4cda1869c06ebadfb6488550015a88522c", "30e93e864e669d82224b967c3020b8fa8d1e4e350b6cbcc537a48b57841163a2" ], [ "948dcadf5990e048aa3874d46abef9d701858f95de8041d2a6828c99e2262519", "e491a42537f6e597d5d28a3224b1bc25df9154efbd2ef1d2cbba2cae5347d57e" ], [ "7962414450c76c1689c7b48f8202ec37fb224cf5ac0bfa1570328a8a3d7c77ab", "100b610ec4ffb4760d5c1fc133ef6f6b12507a051f04ac5760afa5b29db83437" ], [ "3514087834964b54b15b160644d915485a16977225b8847bb0dd085137ec47ca", "ef0afbb2056205448e1652c48e8127fc6039e77c15c2378b7e7d15a0de293311" ], [ "d3cc30ad6b483e4bc79ce2c9dd8bc54993e947eb8df787b442943d3f7b527eaf", "8b378a22d827278d89c5e9be8f9508ae3c2ad46290358630afb34db04eede0a4" ], [ "1624d84780732860ce1c78fcbfefe08b2b29823db913f6493975ba0ff4847610", "68651cf9b6da903e0914448c6cd9d4ca896878f5282be4c8cc06e2a404078575" ], [ "733ce80da955a8a26902c95633e62a985192474b5af207da6df7b4fd5fc61cd4", "f5435a2bd2badf7d485a4d8b8db9fcce3e1ef8e0201e4578c54673bc1dc5ea1d" ], [ "15d9441254945064cf1a1c33bbd3b49f8966c5092171e699ef258dfab81c045c", "d56eb30b69463e7234f5137b73b84177434800bacebfc685fc37bbe9efe4070d" ], [ "a1d0fcf2ec9de675b612136e5ce70d271c21417c9d2b8aaaac138599d0717940", "edd77f50bcb5a3cab2e90737309667f2641462a54070f3d519212d39c197a629" ], [ "e22fbe15c0af8ccc5780c0735f84dbe9a790badee8245c06c7ca37331cb36980", "a855babad5cd60c88b430a69f53a1a7a38289154964799be43d06d77d31da06" ], [ "311091dd9860e8e20ee13473c1155f5f69635e394704eaa74009452246cfa9b3", "66db656f87d1f04fffd1f04788c06830871ec5a64feee685bd80f0b1286d8374" ], [ "34c1fd04d301be89b31c0442d3e6ac24883928b45a9340781867d4232ec2dbdf", "9414685e97b1b5954bd46f730174136d57f1ceeb487443dc5321857ba73abee" ], [ "f219ea5d6b54701c1c14de5b557eb42a8d13f3abbcd08affcc2a5e6b049b8d63", "4cb95957e83d40b0f73af4544cccf6b1f4b08d3c07b27fb8d8c2962a400766d1" ], [ "d7b8740f74a8fbaab1f683db8f45de26543a5490bca627087236912469a0b448", "fa77968128d9c92ee1010f337ad4717eff15db5ed3c049b3411e0315eaa4593b" ], [ "32d31c222f8f6f0ef86f7c98d3a3335ead5bcd32abdd94289fe4d3091aa824bf", "5f3032f5892156e39ccd3d7915b9e1da2e6dac9e6f26e961118d14b8462e1661" ], [ "7461f371914ab32671045a155d9831ea8793d77cd59592c4340f86cbc18347b5", "8ec0ba238b96bec0cbdddcae0aa442542eee1ff50c986ea6b39847b3cc092ff6" ], [ "ee079adb1df1860074356a25aa38206a6d716b2c3e67453d287698bad7b2b2d6", "8dc2412aafe3be5c4c5f37e0ecc5f9f6a446989af04c4e25ebaac479ec1c8c1e" ], [ "16ec93e447ec83f0467b18302ee620f7e65de331874c9dc72bfd8616ba9da6b5", "5e4631150e62fb40d0e8c2a7ca5804a39d58186a50e497139626778e25b0674d" ], [ "eaa5f980c245f6f038978290afa70b6bd8855897f98b6aa485b96065d537bd99", "f65f5d3e292c2e0819a528391c994624d784869d7e6ea67fb18041024edc07dc" ], [ "78c9407544ac132692ee1910a02439958ae04877151342ea96c4b6b35a49f51", "f3e0319169eb9b85d5404795539a5e68fa1fbd583c064d2462b675f194a3ddb4" ], [ "494f4be219a1a77016dcd838431aea0001cdc8ae7a6fc688726578d9702857a5", "42242a969283a5f339ba7f075e36ba2af925ce30d767ed6e55f4b031880d562c" ], [ "a598a8030da6d86c6bc7f2f5144ea549d28211ea58faa70ebf4c1e665c1fe9b5", "204b5d6f84822c307e4b4a7140737aec23fc63b65b35f86a10026dbd2d864e6b" ], [ "c41916365abb2b5d09192f5f2dbeafec208f020f12570a184dbadc3e58595997", "4f14351d0087efa49d245b328984989d5caf9450f34bfc0ed16e96b58fa9913" ], [ "841d6063a586fa475a724604da03bc5b92a2e0d2e0a36acfe4c73a5514742881", "73867f59c0659e81904f9a1c7543698e62562d6744c169ce7a36de01a8d6154" ], [ "5e95bb399a6971d376026947f89bde2f282b33810928be4ded112ac4d70e20d5", "39f23f366809085beebfc71181313775a99c9aed7d8ba38b161384c746012865" ], [ "36e4641a53948fd476c39f8a99fd974e5ec07564b5315d8bf99471bca0ef2f66", "d2424b1b1abe4eb8164227b085c9aa9456ea13493fd563e06fd51cf5694c78fc" ], [ "336581ea7bfbbb290c191a2f507a41cf5643842170e914faeab27c2c579f726", "ead12168595fe1be99252129b6e56b3391f7ab1410cd1e0ef3dcdcabd2fda224" ], [ "8ab89816dadfd6b6a1f2634fcf00ec8403781025ed6890c4849742706bd43ede", "6fdcef09f2f6d0a044e654aef624136f503d459c3e89845858a47a9129cdd24e" ], [ "1e33f1a746c9c5778133344d9299fcaa20b0938e8acff2544bb40284b8c5fb94", "60660257dd11b3aa9c8ed618d24edff2306d320f1d03010e33a7d2057f3b3b6" ], [ "85b7c1dcb3cec1b7ee7f30ded79dd20a0ed1f4cc18cbcfcfa410361fd8f08f31", "3d98a9cdd026dd43f39048f25a8847f4fcafad1895d7a633c6fed3c35e999511" ], [ "29df9fbd8d9e46509275f4b125d6d45d7fbe9a3b878a7af872a2800661ac5f51", "b4c4fe99c775a606e2d8862179139ffda61dc861c019e55cd2876eb2a27d84b" ], [ "a0b1cae06b0a847a3fea6e671aaf8adfdfe58ca2f768105c8082b2e449fce252", "ae434102edde0958ec4b19d917a6a28e6b72da1834aff0e650f049503a296cf2" ], [ "4e8ceafb9b3e9a136dc7ff67e840295b499dfb3b2133e4ba113f2e4c0e121e5", "cf2174118c8b6d7a4b48f6d534ce5c79422c086a63460502b827ce62a326683c" ], [ "d24a44e047e19b6f5afb81c7ca2f69080a5076689a010919f42725c2b789a33b", "6fb8d5591b466f8fc63db50f1c0f1c69013f996887b8244d2cdec417afea8fa3" ], [ "ea01606a7a6c9cdd249fdfcfacb99584001edd28abbab77b5104e98e8e3b35d4", "322af4908c7312b0cfbfe369f7a7b3cdb7d4494bc2823700cfd652188a3ea98d" ], [ "af8addbf2b661c8a6c6328655eb96651252007d8c5ea31be4ad196de8ce2131f", "6749e67c029b85f52a034eafd096836b2520818680e26ac8f3dfbcdb71749700" ], [ "e3ae1974566ca06cc516d47e0fb165a674a3dabcfca15e722f0e3450f45889", "2aeabe7e4531510116217f07bf4d07300de97e4874f81f533420a72eeb0bd6a4" ], [ "591ee355313d99721cf6993ffed1e3e301993ff3ed258802075ea8ced397e246", "b0ea558a113c30bea60fc4775460c7901ff0b053d25ca2bdeee98f1a4be5d196" ], [ "11396d55fda54c49f19aa97318d8da61fa8584e47b084945077cf03255b52984", "998c74a8cd45ac01289d5833a7beb4744ff536b01b257be4c5767bea93ea57a4" ], [ "3c5d2a1ba39c5a1790000738c9e0c40b8dcdfd5468754b6405540157e017aa7a", "b2284279995a34e2f9d4de7396fc18b80f9b8b9fdd270f6661f79ca4c81bd257" ], [ "cc8704b8a60a0defa3a99a7299f2e9c3fbc395afb04ac078425ef8a1793cc030", "bdd46039feed17881d1e0862db347f8cf395b74fc4bcdc4e940b74e3ac1f1b13" ], [ "c533e4f7ea8555aacd9777ac5cad29b97dd4defccc53ee7ea204119b2889b197", "6f0a256bc5efdf429a2fb6242f1a43a2d9b925bb4a4b3a26bb8e0f45eb596096" ], [ "c14f8f2ccb27d6f109f6d08d03cc96a69ba8c34eec07bbcf566d48e33da6593", "c359d6923bb398f7fd4473e16fe1c28475b740dd098075e6c0e8649113dc3a38" ], [ "a6cbc3046bc6a450bac24789fa17115a4c9739ed75f8f21ce441f72e0b90e6ef", "21ae7f4680e889bb130619e2c0f95a360ceb573c70603139862afd617fa9b9f" ], [ "347d6d9a02c48927ebfb86c1359b1caf130a3c0267d11ce6344b39f99d43cc38", "60ea7f61a353524d1c987f6ecec92f086d565ab687870cb12689ff1e31c74448" ], [ "da6545d2181db8d983f7dcb375ef5866d47c67b1bf31c8cf855ef7437b72656a", "49b96715ab6878a79e78f07ce5680c5d6673051b4935bd897fea824b77dc208a" ], [ "c40747cc9d012cb1a13b8148309c6de7ec25d6945d657146b9d5994b8feb1111", "5ca560753be2a12fc6de6caf2cb489565db936156b9514e1bb5e83037e0fa2d4" ], [ "4e42c8ec82c99798ccf3a610be870e78338c7f713348bd34c8203ef4037f3502", "7571d74ee5e0fb92a7a8b33a07783341a5492144cc54bcc40a94473693606437" ], [ "3775ab7089bc6af823aba2e1af70b236d251cadb0c86743287522a1b3b0dedea", "be52d107bcfa09d8bcb9736a828cfa7fac8db17bf7a76a2c42ad961409018cf7" ], [ "cee31cbf7e34ec379d94fb814d3d775ad954595d1314ba8846959e3e82f74e26", "8fd64a14c06b589c26b947ae2bcf6bfa0149ef0be14ed4d80f448a01c43b1c6d" ], [ "b4f9eaea09b6917619f6ea6a4eb5464efddb58fd45b1ebefcdc1a01d08b47986", "39e5c9925b5a54b07433a4f18c61726f8bb131c012ca542eb24a8ac07200682a" ], [ "d4263dfc3d2df923a0179a48966d30ce84e2515afc3dccc1b77907792ebcc60e", "62dfaf07a0f78feb30e30d6295853ce189e127760ad6cf7fae164e122a208d54" ], [ "48457524820fa65a4f8d35eb6930857c0032acc0a4a2de422233eeda897612c4", "25a748ab367979d98733c38a1fa1c2e7dc6cc07db2d60a9ae7a76aaa49bd0f77" ], [ "dfeeef1881101f2cb11644f3a2afdfc2045e19919152923f367a1767c11cceda", "ecfb7056cf1de042f9420bab396793c0c390bde74b4bbdff16a83ae09a9a7517" ], [ "6d7ef6b17543f8373c573f44e1f389835d89bcbc6062ced36c82df83b8fae859", "cd450ec335438986dfefa10c57fea9bcc521a0959b2d80bbf74b190dca712d10" ], [ "e75605d59102a5a2684500d3b991f2e3f3c88b93225547035af25af66e04541f", "f5c54754a8f71ee540b9b48728473e314f729ac5308b06938360990e2bfad125" ], [ "eb98660f4c4dfaa06a2be453d5020bc99a0c2e60abe388457dd43fefb1ed620c", "6cb9a8876d9cb8520609af3add26cd20a0a7cd8a9411131ce85f44100099223e" ], [ "13e87b027d8514d35939f2e6892b19922154596941888336dc3563e3b8dba942", "fef5a3c68059a6dec5d624114bf1e91aac2b9da568d6abeb2570d55646b8adf1" ], [ "ee163026e9fd6fe017c38f06a5be6fc125424b371ce2708e7bf4491691e5764a", "1acb250f255dd61c43d94ccc670d0f58f49ae3fa15b96623e5430da0ad6c62b2" ], [ "b268f5ef9ad51e4d78de3a750c2dc89b1e626d43505867999932e5db33af3d80", "5f310d4b3c99b9ebb19f77d41c1dee018cf0d34fd4191614003e945a1216e423" ], [ "ff07f3118a9df035e9fad85eb6c7bfe42b02f01ca99ceea3bf7ffdba93c4750d", "438136d603e858a3a5c440c38eccbaddc1d2942114e2eddd4740d098ced1f0d8" ], [ "8d8b9855c7c052a34146fd20ffb658bea4b9f69e0d825ebec16e8c3ce2b526a1", "cdb559eedc2d79f926baf44fb84ea4d44bcf50fee51d7ceb30e2e7f463036758" ], [ "52db0b5384dfbf05bfa9d472d7ae26dfe4b851ceca91b1eba54263180da32b63", "c3b997d050ee5d423ebaf66a6db9f57b3180c902875679de924b69d84a7b375" ], [ "e62f9490d3d51da6395efd24e80919cc7d0f29c3f3fa48c6fff543becbd43352", "6d89ad7ba4876b0b22c2ca280c682862f342c8591f1daf5170e07bfd9ccafa7d" ], [ "7f30ea2476b399b4957509c88f77d0191afa2ff5cb7b14fd6d8e7d65aaab1193", "ca5ef7d4b231c94c3b15389a5f6311e9daff7bb67b103e9880ef4bff637acaec" ], [ "5098ff1e1d9f14fb46a210fada6c903fef0fb7b4a1dd1d9ac60a0361800b7a00", "9731141d81fc8f8084d37c6e7542006b3ee1b40d60dfe5362a5b132fd17ddc0" ], [ "32b78c7de9ee512a72895be6b9cbefa6e2f3c4ccce445c96b9f2c81e2778ad58", "ee1849f513df71e32efc3896ee28260c73bb80547ae2275ba497237794c8753c" ], [ "e2cb74fddc8e9fbcd076eef2a7c72b0ce37d50f08269dfc074b581550547a4f7", "d3aa2ed71c9dd2247a62df062736eb0baddea9e36122d2be8641abcb005cc4a4" ], [ "8438447566d4d7bedadc299496ab357426009a35f235cb141be0d99cd10ae3a8", "c4e1020916980a4da5d01ac5e6ad330734ef0d7906631c4f2390426b2edd791f" ], [ "4162d488b89402039b584c6fc6c308870587d9c46f660b878ab65c82c711d67e", "67163e903236289f776f22c25fb8a3afc1732f2b84b4e95dbda47ae5a0852649" ], [ "3fad3fa84caf0f34f0f89bfd2dcf54fc175d767aec3e50684f3ba4a4bf5f683d", "cd1bc7cb6cc407bb2f0ca647c718a730cf71872e7d0d2a53fa20efcdfe61826" ], [ "674f2600a3007a00568c1a7ce05d0816c1fb84bf1370798f1c69532faeb1a86b", "299d21f9413f33b3edf43b257004580b70db57da0b182259e09eecc69e0d38a5" ], [ "d32f4da54ade74abb81b815ad1fb3b263d82d6c692714bcff87d29bd5ee9f08f", "f9429e738b8e53b968e99016c059707782e14f4535359d582fc416910b3eea87" ], [ "30e4e670435385556e593657135845d36fbb6931f72b08cb1ed954f1e3ce3ff6", "462f9bce619898638499350113bbc9b10a878d35da70740dc695a559eb88db7b" ], [ "be2062003c51cc3004682904330e4dee7f3dcd10b01e580bf1971b04d4cad297", "62188bc49d61e5428573d48a74e1c655b1c61090905682a0d5558ed72dccb9bc" ], [ "93144423ace3451ed29e0fb9ac2af211cb6e84a601df5993c419859fff5df04a", "7c10dfb164c3425f5c71a3f9d7992038f1065224f72bb9d1d902a6d13037b47c" ], [ "b015f8044f5fcbdcf21ca26d6c34fb8197829205c7b7d2a7cb66418c157b112c", "ab8c1e086d04e813744a655b2df8d5f83b3cdc6faa3088c1d3aea1454e3a1d5f" ], [ "d5e9e1da649d97d89e4868117a465a3a4f8a18de57a140d36b3f2af341a21b52", "4cb04437f391ed73111a13cc1d4dd0db1693465c2240480d8955e8592f27447a" ], [ "d3ae41047dd7ca065dbf8ed77b992439983005cd72e16d6f996a5316d36966bb", "bd1aeb21ad22ebb22a10f0303417c6d964f8cdd7df0aca614b10dc14d125ac46" ], [ "463e2763d885f958fc66cdd22800f0a487197d0a82e377b49f80af87c897b065", "bfefacdb0e5d0fd7df3a311a94de062b26b80c61fbc97508b79992671ef7ca7f" ], [ "7985fdfd127c0567c6f53ec1bb63ec3158e597c40bfe747c83cddfc910641917", "603c12daf3d9862ef2b25fe1de289aed24ed291e0ec6708703a5bd567f32ed03" ], [ "74a1ad6b5f76e39db2dd249410eac7f99e74c59cb83d2d0ed5ff1543da7703e9", "cc6157ef18c9c63cd6193d83631bbea0093e0968942e8c33d5737fd790e0db08" ], [ "30682a50703375f602d416664ba19b7fc9bab42c72747463a71d0896b22f6da3", "553e04f6b018b4fa6c8f39e7f311d3176290d0e0f19ca73f17714d9977a22ff8" ], [ "9e2158f0d7c0d5f26c3791efefa79597654e7a2b2464f52b1ee6c1347769ef57", "712fcdd1b9053f09003a3481fa7762e9ffd7c8ef35a38509e2fbf2629008373" ], [ "176e26989a43c9cfeba4029c202538c28172e566e3c4fce7322857f3be327d66", "ed8cc9d04b29eb877d270b4878dc43c19aefd31f4eee09ee7b47834c1fa4b1c3" ], [ "75d46efea3771e6e68abb89a13ad747ecf1892393dfc4f1b7004788c50374da8", "9852390a99507679fd0b86fd2b39a868d7efc22151346e1a3ca4726586a6bed8" ], [ "809a20c67d64900ffb698c4c825f6d5f2310fb0451c869345b7319f645605721", "9e994980d9917e22b76b061927fa04143d096ccc54963e6a5ebfa5f3f8e286c1" ], [ "1b38903a43f7f114ed4500b4eac7083fdefece1cf29c63528d563446f972c180", "4036edc931a60ae889353f77fd53de4a2708b26b6f5da72ad3394119daf408f9" ] ]
}
};
}, {} ],
81: [ function(e, t, r) {
"use strict";
var i = r, n = e("bn.js"), a = e("minimalistic-assert"), s = e("minimalistic-crypto-utils");
i.assert = a;
i.toArray = s.toArray;
i.zero2 = s.zero2;
i.toHex = s.toHex;
i.encode = s.encode;
i.getNAF = function(e, t) {
for (var r = [], i = 1 << t + 1, n = e.clone(); n.cmpn(1) >= 0; ) {
var a;
if (n.isOdd()) {
var s = n.andln(i - 1);
a = s > (i >> 1) - 1 ? (i >> 1) - s : s;
n.isubn(a);
} else a = 0;
r.push(a);
for (var f = 0 !== n.cmpn(0) && 0 === n.andln(i - 1) ? t + 1 : 1, o = 1; o < f; o++) r.push(0);
n.iushrn(f);
}
return r;
};
i.getJSF = function(e, t) {
var r = [ [], [] ];
e = e.clone();
t = t.clone();
for (var i = 0, n = 0; e.cmpn(-i) > 0 || t.cmpn(-n) > 0; ) {
var a, s, f = e.andln(3) + i & 3, o = t.andln(3) + n & 3;
3 === f && (f = -1);
3 === o && (o = -1);
a = 0 == (1 & f) ? 0 : 3 != (c = e.andln(7) + i & 7) && 5 !== c || 2 !== o ? f : -f;
r[0].push(a);
if (0 == (1 & o)) s = 0; else {
var c;
s = 3 != (c = t.andln(7) + n & 7) && 5 !== c || 2 !== f ? o : -o;
}
r[1].push(s);
2 * i === a + 1 && (i = 1 - i);
2 * n === s + 1 && (n = 1 - n);
e.iushrn(1);
t.iushrn(1);
}
return r;
};
i.cachedProperty = function(e, t, r) {
var i = "_" + t;
e.prototype[t] = function() {
return void 0 !== this[i] ? this[i] : this[i] = r.call(this);
};
};
i.parseBytes = function(e) {
return "string" == typeof e ? i.toArray(e, "hex") : e;
};
i.intFromLE = function(e) {
return new n(e, "hex", "le");
};
}, {
"bn.js": 16,
"minimalistic-assert": 105,
"minimalistic-crypto-utils": 106
} ],
82: [ function(e, t, r) {
t.exports = {
_args: [ [ {
raw: "elliptic@^6.0.0",
scope: null,
escapedName: "elliptic",
name: "elliptic",
rawSpec: "^6.0.0",
spec: ">=6.0.0 <7.0.0",
type: "range"
}, "/Users/nantas/fireball-x/fireball_2.1-release/dist/CocosCreator.app/Contents/Resources/app/node_modules/browserify-sign" ] ],
_cnpm_publish_time: 1533787091648,
_from: "elliptic@^6.0.0",
_hasShrinkwrap: !1,
_id: "elliptic@6.4.1",
_location: "/elliptic",
_nodeVersion: "10.5.0",
_npmOperationalInternal: {
host: "s3://npm-registry-packages",
tmp: "tmp/elliptic_6.4.1_1533787091502_0.6309761823717674"
},
_npmUser: {
name: "indutny",
email: "fedor@indutny.com"
},
_npmVersion: "6.3.0",
_phantomChildren: {},
_requested: {
raw: "elliptic@^6.0.0",
scope: null,
escapedName: "elliptic",
name: "elliptic",
rawSpec: "^6.0.0",
spec: ">=6.0.0 <7.0.0",
type: "range"
},
_requiredBy: [ "/browserify-sign", "/create-ecdh" ],
_resolved: "http://registry.npm.taobao.org/elliptic/download/elliptic-6.4.1.tgz",
_shasum: "c2d0b7776911b86722c632c3c06c60f2f819939a",
_shrinkwrap: null,
_spec: "elliptic@^6.0.0",
_where: "/Users/nantas/fireball-x/fireball_2.1-release/dist/CocosCreator.app/Contents/Resources/app/node_modules/browserify-sign",
author: {
name: "Fedor Indutny",
email: "fedor@indutny.com"
},
bugs: {
url: "https://github.com/indutny/elliptic/issues"
},
dependencies: {
"bn.js": "^4.4.0",
brorand: "^1.0.1",
"hash.js": "^1.0.0",
"hmac-drbg": "^1.0.0",
inherits: "^2.0.1",
"minimalistic-assert": "^1.0.0",
"minimalistic-crypto-utils": "^1.0.0"
},
description: "EC cryptography",
devDependencies: {
brfs: "^1.4.3",
coveralls: "^2.11.3",
grunt: "^0.4.5",
"grunt-browserify": "^5.0.0",
"grunt-cli": "^1.2.0",
"grunt-contrib-connect": "^1.0.0",
"grunt-contrib-copy": "^1.0.0",
"grunt-contrib-uglify": "^1.0.1",
"grunt-mocha-istanbul": "^3.0.1",
"grunt-saucelabs": "^8.6.2",
istanbul: "^0.4.2",
jscs: "^2.9.0",
jshint: "^2.6.0",
mocha: "^2.1.0"
},
directories: {},
dist: {
shasum: "c2d0b7776911b86722c632c3c06c60f2f819939a",
size: 39520,
noattachment: !1,
tarball: "http://registry.npm.taobao.org/elliptic/download/elliptic-6.4.1.tgz"
},
files: [ "lib" ],
gitHead: "523da1cf71ddcfd607fbdee1858bc2af47f0e700",
homepage: "https://github.com/indutny/elliptic",
keywords: [ "EC", "Elliptic", "curve", "Cryptography" ],
license: "MIT",
main: "lib/elliptic.js",
maintainers: [ {
name: "indutny",
email: "fedor@indutny.com"
} ],
name: "elliptic",
optionalDependencies: {},
publish_time: 1533787091648,
readme: "# Elliptic [![Build Status](https://secure.travis-ci.org/indutny/elliptic.png)](http://travis-ci.org/indutny/elliptic) [![Coverage Status](https://coveralls.io/repos/indutny/elliptic/badge.svg?branch=master&service=github)](https://coveralls.io/github/indutny/elliptic?branch=master) [![Code Climate](https://codeclimate.com/github/indutny/elliptic/badges/gpa.svg)](https://codeclimate.com/github/indutny/elliptic)\n\n[![Saucelabs Test Status](https://saucelabs.com/browser-matrix/gh-indutny-elliptic.svg)](https://saucelabs.com/u/gh-indutny-elliptic)\n\nFast elliptic-curve cryptography in a plain javascript implementation.\n\nNOTE: Please take a look at http://safecurves.cr.yp.to/ before choosing a curve\nfor your cryptography operations.\n\n## Incentive\n\nECC is much slower than regular RSA cryptography, the JS implementations are\neven more slower.\n\n## Benchmarks\n\n```bash\n$ node benchmarks/index.js\nBenchmarking: sign\nelliptic#sign x 262 ops/sec ±0.51% (177 runs sampled)\neccjs#sign x 55.91 ops/sec ±0.90% (144 runs sampled)\n------------------------\nFastest is elliptic#sign\n========================\nBenchmarking: verify\nelliptic#verify x 113 ops/sec ±0.50% (166 runs sampled)\neccjs#verify x 48.56 ops/sec ±0.36% (125 runs sampled)\n------------------------\nFastest is elliptic#verify\n========================\nBenchmarking: gen\nelliptic#gen x 294 ops/sec ±0.43% (176 runs sampled)\neccjs#gen x 62.25 ops/sec ±0.63% (129 runs sampled)\n------------------------\nFastest is elliptic#gen\n========================\nBenchmarking: ecdh\nelliptic#ecdh x 136 ops/sec ±0.85% (156 runs sampled)\n------------------------\nFastest is elliptic#ecdh\n========================\n```\n\n## API\n\n### ECDSA\n\n```javascript\nvar EC = require('elliptic').ec;\n\n// Create and initialize EC context\n// (better do it once and reuse it)\nvar ec = new EC('secp256k1');\n\n// Generate keys\nvar key = ec.genKeyPair();\n\n// Sign the message's hash (input must be an array, or a hex-string)\nvar msgHash = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];\nvar signature = key.sign(msgHash);\n\n// Export DER encoded signature in Array\nvar derSign = signature.toDER();\n\n// Verify signature\nconsole.log(key.verify(msgHash, derSign));\n\n// CHECK WITH NO PRIVATE KEY\n\nvar pubPoint = key.getPublic();\nvar x = pubPoint.getX();\nvar y = pubPoint.getY();\n\n// Public Key MUST be either:\n// 1) '04' + hex string of x + hex string of y; or\n// 2) object with two hex string properties (x and y); or\n// 3) object with two buffer properties (x and y)\nvar pub = pubPoint.encode('hex');                                 // case 1\nvar pub = { x: x.toString('hex'), y: y.toString('hex') };         // case 2\nvar pub = { x: x.toBuffer(), y: y.toBuffer() };                   // case 3\nvar pub = { x: x.toArrayLike(Buffer), y: y.toArrayLike(Buffer) }; // case 3\n\n// Import public key\nvar key = ec.keyFromPublic(pub, 'hex');\n\n// Signature MUST be either:\n// 1) DER-encoded signature as hex-string; or\n// 2) DER-encoded signature as buffer; or\n// 3) object with two hex-string properties (r and s); or\n// 4) object with two buffer properties (r and s)\n\nvar signature = '3046022100...'; // case 1\nvar signature = new Buffer('...'); // case 2\nvar signature = { r: 'b1fc...', s: '9c42...' }; // case 3\n\n// Verify signature\nconsole.log(key.verify(msgHash, signature));\n```\n\n### EdDSA\n\n```javascript\nvar EdDSA = require('elliptic').eddsa;\n\n// Create and initialize EdDSA context\n// (better do it once and reuse it)\nvar ec = new EdDSA('ed25519');\n\n// Create key pair from secret\nvar key = ec.keyFromSecret('693e3c...'); // hex string, array or Buffer\n\n// Sign the message's hash (input must be an array, or a hex-string)\nvar msgHash = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];\nvar signature = key.sign(msgHash).toHex();\n\n// Verify signature\nconsole.log(key.verify(msgHash, signature));\n\n// CHECK WITH NO PRIVATE KEY\n\n// Import public key\nvar pub = '0a1af638...';\nvar key = ec.keyFromPublic(pub, 'hex');\n\n// Verify signature\nvar signature = '70bed1...';\nconsole.log(key.verify(msgHash, signature));\n```\n\n### ECDH\n\n```javascript\nvar EC = require('elliptic').ec;\nvar ec = new EC('curve25519');\n\n// Generate keys\nvar key1 = ec.genKeyPair();\nvar key2 = ec.genKeyPair();\n\nvar shared1 = key1.derive(key2.getPublic());\nvar shared2 = key2.derive(key1.getPublic());\n\nconsole.log('Both shared secrets are BN instances');\nconsole.log(shared1.toString(16));\nconsole.log(shared2.toString(16));\n```\n\nthree and more members:\n```javascript\nvar EC = require('elliptic').ec;\nvar ec = new EC('curve25519');\n\nvar A = ec.genKeyPair();\nvar B = ec.genKeyPair();\nvar C = ec.genKeyPair();\n\nvar AB = A.getPublic().mul(B.getPrivate())\nvar BC = B.getPublic().mul(C.getPrivate())\nvar CA = C.getPublic().mul(A.getPrivate())\n\nvar ABC = AB.mul(C.getPrivate())\nvar BCA = BC.mul(A.getPrivate())\nvar CAB = CA.mul(B.getPrivate())\n\nconsole.log(ABC.getX().toString(16))\nconsole.log(BCA.getX().toString(16))\nconsole.log(CAB.getX().toString(16))\n```\n\nNOTE: `.derive()` returns a [BN][1] instance.\n\n## Supported curves\n\nElliptic.js support following curve types:\n\n* Short Weierstrass\n* Montgomery\n* Edwards\n* Twisted Edwards\n\nFollowing curve 'presets' are embedded into the library:\n\n* `secp256k1`\n* `p192`\n* `p224`\n* `p256`\n* `p384`\n* `p521`\n* `curve25519`\n* `ed25519`\n\nNOTE: That `curve25519` could not be used for ECDSA, use `ed25519` instead.\n\n### Implementation details\n\nECDSA is using deterministic `k` value generation as per [RFC6979][0]. Most of\nthe curve operations are performed on non-affine coordinates (either projective\nor extended), various windowing techniques are used for different cases.\n\nAll operations are performed in reduction context using [bn.js][1], hashing is\nprovided by [hash.js][2]\n\n### Related projects\n\n* [eccrypto][3]: isomorphic implementation of ECDSA, ECDH and ECIES for both\n  browserify and node (uses `elliptic` for browser and [secp256k1-node][4] for\n  node)\n\n#### LICENSE\n\nThis software is licensed under the MIT License.\n\nCopyright Fedor Indutny, 2014.\n\nPermission is hereby granted, free of charge, to any person obtaining a\ncopy of this software and associated documentation files (the\n\"Software\"), to deal in the Software without restriction, including\nwithout limitation the rights to use, copy, modify, merge, publish,\ndistribute, sublicense, and/or sell copies of the Software, and to permit\npersons to whom the Software is furnished to do so, subject to the\nfollowing conditions:\n\nThe above copyright notice and this permission notice shall be included\nin all copies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS\nOR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF\nMERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN\nNO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,\nDAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR\nOTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE\nUSE OR OTHER DEALINGS IN THE SOFTWARE.\n\n[0]: http://tools.ietf.org/html/rfc6979\n[1]: https://github.com/indutny/bn.js\n[2]: https://github.com/indutny/hash.js\n[3]: https://github.com/bitchan/eccrypto\n[4]: https://github.com/wanderer/secp256k1-node\n",
readmeFilename: "README.md",
repository: {
type: "git",
url: "git+ssh://git@github.com/indutny/elliptic.git"
},
scripts: {
jscs: "jscs benchmarks/*.js lib/*.js lib/**/*.js lib/**/**/*.js test/index.js",
jshint: "jscs benchmarks/*.js lib/*.js lib/**/*.js lib/**/**/*.js test/index.js",
lint: "npm run jscs && npm run jshint",
test: "npm run lint && npm run unit",
unit: "istanbul test _mocha --reporter=spec test/index.js",
version: "grunt dist && git add dist/"
},
version: "6.4.1"
};
}, {} ],
83: [ function(e, t, r) {
function i() {
this._events = this._events || {};
this._maxListeners = this._maxListeners || void 0;
}
t.exports = i;
i.EventEmitter = i;
i.prototype._events = void 0;
i.prototype._maxListeners = void 0;
i.defaultMaxListeners = 10;
i.prototype.setMaxListeners = function(e) {
if (!function(e) {
return "number" == typeof e;
}(e) || e < 0 || isNaN(e)) throw TypeError("n must be a positive number");
this._maxListeners = e;
return this;
};
i.prototype.emit = function(e) {
var t, r, i, f, o, c;
this._events || (this._events = {});
if ("error" === e && (!this._events.error || a(this._events.error) && !this._events.error.length)) {
if ((t = arguments[1]) instanceof Error) throw t;
var h = new Error('Uncaught, unspecified "error" event. (' + t + ")");
h.context = t;
throw h;
}
if (s(r = this._events[e])) return !1;
if (n(r)) switch (arguments.length) {
case 1:
r.call(this);
break;

case 2:
r.call(this, arguments[1]);
break;

case 3:
r.call(this, arguments[1], arguments[2]);
break;

default:
f = Array.prototype.slice.call(arguments, 1);
r.apply(this, f);
} else if (a(r)) {
f = Array.prototype.slice.call(arguments, 1);
i = (c = r.slice()).length;
for (o = 0; o < i; o++) c[o].apply(this, f);
}
return !0;
};
i.prototype.addListener = function(e, t) {
var r;
if (!n(t)) throw TypeError("listener must be a function");
this._events || (this._events = {});
this._events.newListener && this.emit("newListener", e, n(t.listener) ? t.listener : t);
this._events[e] ? a(this._events[e]) ? this._events[e].push(t) : this._events[e] = [ this._events[e], t ] : this._events[e] = t;
if (a(this._events[e]) && !this._events[e].warned && (r = s(this._maxListeners) ? i.defaultMaxListeners : this._maxListeners) && r > 0 && this._events[e].length > r) {
this._events[e].warned = !0;
console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.", this._events[e].length);
"function" == typeof console.trace && console.trace();
}
return this;
};
i.prototype.on = i.prototype.addListener;
i.prototype.once = function(e, t) {
if (!n(t)) throw TypeError("listener must be a function");
var r = !1;
function i() {
this.removeListener(e, i);
if (!r) {
r = !0;
t.apply(this, arguments);
}
}
i.listener = t;
this.on(e, i);
return this;
};
i.prototype.removeListener = function(e, t) {
var r, i, s, f;
if (!n(t)) throw TypeError("listener must be a function");
if (!this._events || !this._events[e]) return this;
s = (r = this._events[e]).length;
i = -1;
if (r === t || n(r.listener) && r.listener === t) {
delete this._events[e];
this._events.removeListener && this.emit("removeListener", e, t);
} else if (a(r)) {
for (f = s; f-- > 0; ) if (r[f] === t || r[f].listener && r[f].listener === t) {
i = f;
break;
}
if (i < 0) return this;
if (1 === r.length) {
r.length = 0;
delete this._events[e];
} else r.splice(i, 1);
this._events.removeListener && this.emit("removeListener", e, t);
}
return this;
};
i.prototype.removeAllListeners = function(e) {
var t, r;
if (!this._events) return this;
if (!this._events.removeListener) {
0 === arguments.length ? this._events = {} : this._events[e] && delete this._events[e];
return this;
}
if (0 === arguments.length) {
for (t in this._events) "removeListener" !== t && this.removeAllListeners(t);
this.removeAllListeners("removeListener");
this._events = {};
return this;
}
if (n(r = this._events[e])) this.removeListener(e, r); else if (r) for (;r.length; ) this.removeListener(e, r[r.length - 1]);
delete this._events[e];
return this;
};
i.prototype.listeners = function(e) {
return this._events && this._events[e] ? n(this._events[e]) ? [ this._events[e] ] : this._events[e].slice() : [];
};
i.prototype.listenerCount = function(e) {
if (this._events) {
var t = this._events[e];
if (n(t)) return 1;
if (t) return t.length;
}
return 0;
};
i.listenerCount = function(e, t) {
return e.listenerCount(t);
};
function n(e) {
return "function" == typeof e;
}
function a(e) {
return "object" == typeof e && null !== e;
}
function s(e) {
return void 0 === e;
}
}, {} ],
84: [ function(e, t, r) {
var i = e("safe-buffer").Buffer, n = e("md5.js");
t.exports = function(e, t, r, a) {
i.isBuffer(e) || (e = i.from(e, "binary"));
if (t) {
i.isBuffer(t) || (t = i.from(t, "binary"));
if (8 !== t.length) throw new RangeError("salt should be Buffer with 8 byte length");
}
for (var s = r / 8, f = i.alloc(s), o = i.alloc(a || 0), c = i.alloc(0); s > 0 || a > 0; ) {
var h = new n();
h.update(c);
h.update(e);
t && h.update(t);
c = h.digest();
var d = 0;
if (s > 0) {
var u = f.length - s;
d = Math.min(s, c.length);
c.copy(f, u, 0, d);
s -= d;
}
if (d < c.length && a > 0) {
var l = o.length - a, p = Math.min(a, c.length - d);
c.copy(o, l, d, d + p);
a -= p;
}
}
c.fill(0);
return {
key: f,
iv: o
};
};
}, {
"md5.js": 103,
"safe-buffer": 143
} ],
85: [ function(e, t, r) {
"use strict";
var i = e("safe-buffer").Buffer, n = e("stream").Transform;
function a(e) {
n.call(this);
this._block = i.allocUnsafe(e);
this._blockSize = e;
this._blockOffset = 0;
this._length = [ 0, 0, 0, 0 ];
this._finalized = !1;
}
e("inherits")(a, n);
a.prototype._transform = function(e, t, r) {
var i = null;
try {
this.update(e, t);
} catch (e) {
i = e;
}
r(i);
};
a.prototype._flush = function(e) {
var t = null;
try {
this.push(this.digest());
} catch (e) {
t = e;
}
e(t);
};
a.prototype.update = function(e, t) {
(function(e, t) {
if (!i.isBuffer(e) && "string" != typeof e) throw new TypeError(t + " must be a string or a buffer");
})(e, "Data");
if (this._finalized) throw new Error("Digest already called");
i.isBuffer(e) || (e = i.from(e, t));
for (var r = this._block, n = 0; this._blockOffset + e.length - n >= this._blockSize; ) {
for (var a = this._blockOffset; a < this._blockSize; ) r[a++] = e[n++];
this._update();
this._blockOffset = 0;
}
for (;n < e.length; ) r[this._blockOffset++] = e[n++];
for (var s = 0, f = 8 * e.length; f > 0; ++s) {
this._length[s] += f;
(f = this._length[s] / 4294967296 | 0) > 0 && (this._length[s] -= 4294967296 * f);
}
return this;
};
a.prototype._update = function() {
throw new Error("_update is not implemented");
};
a.prototype.digest = function(e) {
if (this._finalized) throw new Error("Digest already called");
this._finalized = !0;
var t = this._digest();
void 0 !== e && (t = t.toString(e));
this._block.fill(0);
this._blockOffset = 0;
for (var r = 0; r < 4; ++r) this._length[r] = 0;
return t;
};
a.prototype._digest = function() {
throw new Error("_digest is not implemented");
};
t.exports = a;
}, {
inherits: 101,
"safe-buffer": 143,
stream: 152
} ],
86: [ function(e, t, r) {
var i = r;
i.utils = e("./hash/utils");
i.common = e("./hash/common");
i.sha = e("./hash/sha");
i.ripemd = e("./hash/ripemd");
i.hmac = e("./hash/hmac");
i.sha1 = i.sha.sha1;
i.sha256 = i.sha.sha256;
i.sha224 = i.sha.sha224;
i.sha384 = i.sha.sha384;
i.sha512 = i.sha.sha512;
i.ripemd160 = i.ripemd.ripemd160;
}, {
"./hash/common": 87,
"./hash/hmac": 88,
"./hash/ripemd": 89,
"./hash/sha": 90,
"./hash/utils": 97
} ],
87: [ function(e, t, r) {
"use strict";
var i = e("./utils"), n = e("minimalistic-assert");
function a() {
this.pending = null;
this.pendingTotal = 0;
this.blockSize = this.constructor.blockSize;
this.outSize = this.constructor.outSize;
this.hmacStrength = this.constructor.hmacStrength;
this.padLength = this.constructor.padLength / 8;
this.endian = "big";
this._delta8 = this.blockSize / 8;
this._delta32 = this.blockSize / 32;
}
r.BlockHash = a;
a.prototype.update = function(e, t) {
e = i.toArray(e, t);
this.pending ? this.pending = this.pending.concat(e) : this.pending = e;
this.pendingTotal += e.length;
if (this.pending.length >= this._delta8) {
var r = (e = this.pending).length % this._delta8;
this.pending = e.slice(e.length - r, e.length);
0 === this.pending.length && (this.pending = null);
e = i.join32(e, 0, e.length - r, this.endian);
for (var n = 0; n < e.length; n += this._delta32) this._update(e, n, n + this._delta32);
}
return this;
};
a.prototype.digest = function(e) {
this.update(this._pad());
n(null === this.pending);
return this._digest(e);
};
a.prototype._pad = function() {
var e = this.pendingTotal, t = this._delta8, r = t - (e + this.padLength) % t, i = new Array(r + this.padLength);
i[0] = 128;
for (var n = 1; n < r; n++) i[n] = 0;
e <<= 3;
if ("big" === this.endian) {
for (var a = 8; a < this.padLength; a++) i[n++] = 0;
i[n++] = 0;
i[n++] = 0;
i[n++] = 0;
i[n++] = 0;
i[n++] = e >>> 24 & 255;
i[n++] = e >>> 16 & 255;
i[n++] = e >>> 8 & 255;
i[n++] = 255 & e;
} else {
i[n++] = 255 & e;
i[n++] = e >>> 8 & 255;
i[n++] = e >>> 16 & 255;
i[n++] = e >>> 24 & 255;
i[n++] = 0;
i[n++] = 0;
i[n++] = 0;
i[n++] = 0;
for (a = 8; a < this.padLength; a++) i[n++] = 0;
}
return i;
};
}, {
"./utils": 97,
"minimalistic-assert": 105
} ],
88: [ function(e, t, r) {
"use strict";
var i = e("./utils"), n = e("minimalistic-assert");
function a(e, t, r) {
if (!(this instanceof a)) return new a(e, t, r);
this.Hash = e;
this.blockSize = e.blockSize / 8;
this.outSize = e.outSize / 8;
this.inner = null;
this.outer = null;
this._init(i.toArray(t, r));
}
t.exports = a;
a.prototype._init = function(e) {
e.length > this.blockSize && (e = new this.Hash().update(e).digest());
n(e.length <= this.blockSize);
for (var t = e.length; t < this.blockSize; t++) e.push(0);
for (t = 0; t < e.length; t++) e[t] ^= 54;
this.inner = new this.Hash().update(e);
for (t = 0; t < e.length; t++) e[t] ^= 106;
this.outer = new this.Hash().update(e);
};
a.prototype.update = function(e, t) {
this.inner.update(e, t);
return this;
};
a.prototype.digest = function(e) {
this.outer.update(this.inner.digest());
return this.outer.digest(e);
};
}, {
"./utils": 97,
"minimalistic-assert": 105
} ],
89: [ function(e, t, r) {
"use strict";
var i = e("./utils"), n = e("./common"), a = i.rotl32, s = i.sum32, f = i.sum32_3, o = i.sum32_4, c = n.BlockHash;
function h() {
if (!(this instanceof h)) return new h();
c.call(this);
this.h = [ 1732584193, 4023233417, 2562383102, 271733878, 3285377520 ];
this.endian = "little";
}
i.inherits(h, c);
r.ripemd160 = h;
h.blockSize = 512;
h.outSize = 160;
h.hmacStrength = 192;
h.padLength = 64;
h.prototype._update = function(e, t) {
for (var r = this.h[0], i = this.h[1], n = this.h[2], c = this.h[3], h = this.h[4], y = r, v = i, _ = n, w = c, S = h, E = 0; E < 80; E++) {
var M = s(a(o(r, d(E, i, n, c), e[p[E] + t], u(E)), g[E]), h);
r = h;
h = c;
c = a(n, 10);
n = i;
i = M;
M = s(a(o(y, d(79 - E, v, _, w), e[b[E] + t], l(E)), m[E]), S);
y = S;
S = w;
w = a(_, 10);
_ = v;
v = M;
}
M = f(this.h[1], n, w);
this.h[1] = f(this.h[2], c, S);
this.h[2] = f(this.h[3], h, y);
this.h[3] = f(this.h[4], r, v);
this.h[4] = f(this.h[0], i, _);
this.h[0] = M;
};
h.prototype._digest = function(e) {
return "hex" === e ? i.toHex32(this.h, "little") : i.split32(this.h, "little");
};
function d(e, t, r, i) {
return e <= 15 ? t ^ r ^ i : e <= 31 ? t & r | ~t & i : e <= 47 ? (t | ~r) ^ i : e <= 63 ? t & i | r & ~i : t ^ (r | ~i);
}
function u(e) {
return e <= 15 ? 0 : e <= 31 ? 1518500249 : e <= 47 ? 1859775393 : e <= 63 ? 2400959708 : 2840853838;
}
function l(e) {
return e <= 15 ? 1352829926 : e <= 31 ? 1548603684 : e <= 47 ? 1836072691 : e <= 63 ? 2053994217 : 0;
}
var p = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13 ], b = [ 5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11 ], g = [ 11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6 ], m = [ 8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11 ];
}, {
"./common": 87,
"./utils": 97
} ],
90: [ function(e, t, r) {
"use strict";
r.sha1 = e("./sha/1");
r.sha224 = e("./sha/224");
r.sha256 = e("./sha/256");
r.sha384 = e("./sha/384");
r.sha512 = e("./sha/512");
}, {
"./sha/1": 91,
"./sha/224": 92,
"./sha/256": 93,
"./sha/384": 94,
"./sha/512": 95
} ],
91: [ function(e, t, r) {
"use strict";
var i = e("../utils"), n = e("../common"), a = e("./common"), s = i.rotl32, f = i.sum32, o = i.sum32_5, c = a.ft_1, h = n.BlockHash, d = [ 1518500249, 1859775393, 2400959708, 3395469782 ];
function u() {
if (!(this instanceof u)) return new u();
h.call(this);
this.h = [ 1732584193, 4023233417, 2562383102, 271733878, 3285377520 ];
this.W = new Array(80);
}
i.inherits(u, h);
t.exports = u;
u.blockSize = 512;
u.outSize = 160;
u.hmacStrength = 80;
u.padLength = 64;
u.prototype._update = function(e, t) {
for (var r = this.W, i = 0; i < 16; i++) r[i] = e[t + i];
for (;i < r.length; i++) r[i] = s(r[i - 3] ^ r[i - 8] ^ r[i - 14] ^ r[i - 16], 1);
var n = this.h[0], a = this.h[1], h = this.h[2], u = this.h[3], l = this.h[4];
for (i = 0; i < r.length; i++) {
var p = ~~(i / 20), b = o(s(n, 5), c(p, a, h, u), l, r[i], d[p]);
l = u;
u = h;
h = s(a, 30);
a = n;
n = b;
}
this.h[0] = f(this.h[0], n);
this.h[1] = f(this.h[1], a);
this.h[2] = f(this.h[2], h);
this.h[3] = f(this.h[3], u);
this.h[4] = f(this.h[4], l);
};
u.prototype._digest = function(e) {
return "hex" === e ? i.toHex32(this.h, "big") : i.split32(this.h, "big");
};
}, {
"../common": 87,
"../utils": 97,
"./common": 96
} ],
92: [ function(e, t, r) {
"use strict";
var i = e("../utils"), n = e("./256");
function a() {
if (!(this instanceof a)) return new a();
n.call(this);
this.h = [ 3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428 ];
}
i.inherits(a, n);
t.exports = a;
a.blockSize = 512;
a.outSize = 224;
a.hmacStrength = 192;
a.padLength = 64;
a.prototype._digest = function(e) {
return "hex" === e ? i.toHex32(this.h.slice(0, 7), "big") : i.split32(this.h.slice(0, 7), "big");
};
}, {
"../utils": 97,
"./256": 93
} ],
93: [ function(e, t, r) {
"use strict";
var i = e("../utils"), n = e("../common"), a = e("./common"), s = e("minimalistic-assert"), f = i.sum32, o = i.sum32_4, c = i.sum32_5, h = a.ch32, d = a.maj32, u = a.s0_256, l = a.s1_256, p = a.g0_256, b = a.g1_256, g = n.BlockHash, m = [ 1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298 ];
function y() {
if (!(this instanceof y)) return new y();
g.call(this);
this.h = [ 1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225 ];
this.k = m;
this.W = new Array(64);
}
i.inherits(y, g);
t.exports = y;
y.blockSize = 512;
y.outSize = 256;
y.hmacStrength = 192;
y.padLength = 64;
y.prototype._update = function(e, t) {
for (var r = this.W, i = 0; i < 16; i++) r[i] = e[t + i];
for (;i < r.length; i++) r[i] = o(b(r[i - 2]), r[i - 7], p(r[i - 15]), r[i - 16]);
var n = this.h[0], a = this.h[1], g = this.h[2], m = this.h[3], y = this.h[4], v = this.h[5], _ = this.h[6], w = this.h[7];
s(this.k.length === r.length);
for (i = 0; i < r.length; i++) {
var S = c(w, l(y), h(y, v, _), this.k[i], r[i]), E = f(u(n), d(n, a, g));
w = _;
_ = v;
v = y;
y = f(m, S);
m = g;
g = a;
a = n;
n = f(S, E);
}
this.h[0] = f(this.h[0], n);
this.h[1] = f(this.h[1], a);
this.h[2] = f(this.h[2], g);
this.h[3] = f(this.h[3], m);
this.h[4] = f(this.h[4], y);
this.h[5] = f(this.h[5], v);
this.h[6] = f(this.h[6], _);
this.h[7] = f(this.h[7], w);
};
y.prototype._digest = function(e) {
return "hex" === e ? i.toHex32(this.h, "big") : i.split32(this.h, "big");
};
}, {
"../common": 87,
"../utils": 97,
"./common": 96,
"minimalistic-assert": 105
} ],
94: [ function(e, t, r) {
"use strict";
var i = e("../utils"), n = e("./512");
function a() {
if (!(this instanceof a)) return new a();
n.call(this);
this.h = [ 3418070365, 3238371032, 1654270250, 914150663, 2438529370, 812702999, 355462360, 4144912697, 1731405415, 4290775857, 2394180231, 1750603025, 3675008525, 1694076839, 1203062813, 3204075428 ];
}
i.inherits(a, n);
t.exports = a;
a.blockSize = 1024;
a.outSize = 384;
a.hmacStrength = 192;
a.padLength = 128;
a.prototype._digest = function(e) {
return "hex" === e ? i.toHex32(this.h.slice(0, 12), "big") : i.split32(this.h.slice(0, 12), "big");
};
}, {
"../utils": 97,
"./512": 95
} ],
95: [ function(e, t, r) {
"use strict";
var i = e("../utils"), n = e("../common"), a = e("minimalistic-assert"), s = i.rotr64_hi, f = i.rotr64_lo, o = i.shr64_hi, c = i.shr64_lo, h = i.sum64, d = i.sum64_hi, u = i.sum64_lo, l = i.sum64_4_hi, p = i.sum64_4_lo, b = i.sum64_5_hi, g = i.sum64_5_lo, m = n.BlockHash, y = [ 1116352408, 3609767458, 1899447441, 602891725, 3049323471, 3964484399, 3921009573, 2173295548, 961987163, 4081628472, 1508970993, 3053834265, 2453635748, 2937671579, 2870763221, 3664609560, 3624381080, 2734883394, 310598401, 1164996542, 607225278, 1323610764, 1426881987, 3590304994, 1925078388, 4068182383, 2162078206, 991336113, 2614888103, 633803317, 3248222580, 3479774868, 3835390401, 2666613458, 4022224774, 944711139, 264347078, 2341262773, 604807628, 2007800933, 770255983, 1495990901, 1249150122, 1856431235, 1555081692, 3175218132, 1996064986, 2198950837, 2554220882, 3999719339, 2821834349, 766784016, 2952996808, 2566594879, 3210313671, 3203337956, 3336571891, 1034457026, 3584528711, 2466948901, 113926993, 3758326383, 338241895, 168717936, 666307205, 1188179964, 773529912, 1546045734, 1294757372, 1522805485, 1396182291, 2643833823, 1695183700, 2343527390, 1986661051, 1014477480, 2177026350, 1206759142, 2456956037, 344077627, 2730485921, 1290863460, 2820302411, 3158454273, 3259730800, 3505952657, 3345764771, 106217008, 3516065817, 3606008344, 3600352804, 1432725776, 4094571909, 1467031594, 275423344, 851169720, 430227734, 3100823752, 506948616, 1363258195, 659060556, 3750685593, 883997877, 3785050280, 958139571, 3318307427, 1322822218, 3812723403, 1537002063, 2003034995, 1747873779, 3602036899, 1955562222, 1575990012, 2024104815, 1125592928, 2227730452, 2716904306, 2361852424, 442776044, 2428436474, 593698344, 2756734187, 3733110249, 3204031479, 2999351573, 3329325298, 3815920427, 3391569614, 3928383900, 3515267271, 566280711, 3940187606, 3454069534, 4118630271, 4000239992, 116418474, 1914138554, 174292421, 2731055270, 289380356, 3203993006, 460393269, 320620315, 685471733, 587496836, 852142971, 1086792851, 1017036298, 365543100, 1126000580, 2618297676, 1288033470, 3409855158, 1501505948, 4234509866, 1607167915, 987167468, 1816402316, 1246189591 ];
function v() {
if (!(this instanceof v)) return new v();
m.call(this);
this.h = [ 1779033703, 4089235720, 3144134277, 2227873595, 1013904242, 4271175723, 2773480762, 1595750129, 1359893119, 2917565137, 2600822924, 725511199, 528734635, 4215389547, 1541459225, 327033209 ];
this.k = y;
this.W = new Array(160);
}
i.inherits(v, m);
t.exports = v;
v.blockSize = 1024;
v.outSize = 512;
v.hmacStrength = 192;
v.padLength = 128;
v.prototype._prepareBlock = function(e, t) {
for (var r = this.W, i = 0; i < 32; i++) r[i] = e[t + i];
for (;i < r.length; i += 2) {
var n = B(r[i - 4], r[i - 3]), a = C(r[i - 4], r[i - 3]), s = r[i - 14], f = r[i - 13], o = I(r[i - 30], r[i - 29]), c = R(r[i - 30], r[i - 29]), h = r[i - 32], d = r[i - 31];
r[i] = l(n, a, s, f, o, c, h, d);
r[i + 1] = p(n, a, s, f, o, c, h, d);
}
};
v.prototype._update = function(e, t) {
this._prepareBlock(e, t);
var r = this.W, i = this.h[0], n = this.h[1], s = this.h[2], f = this.h[3], o = this.h[4], c = this.h[5], l = this.h[6], p = this.h[7], m = this.h[8], y = this.h[9], v = this.h[10], I = this.h[11], R = this.h[12], B = this.h[13], C = this.h[14], j = this.h[15];
a(this.k.length === r.length);
for (var P = 0; P < r.length; P += 2) {
var T = C, U = j, D = A(m, y), N = x(m, y), O = _(m, y, v, I, R), L = w(m, y, v, I, R, B), z = this.k[P], q = this.k[P + 1], F = r[P], H = r[P + 1], K = b(T, U, D, N, O, L, z, q, F, H), Y = g(T, U, D, N, O, L, z, q, F, H);
T = M(i, n);
U = k(i, n);
D = S(i, n, s, f, o);
N = E(i, n, s, f, o, c);
var W = d(T, U, D, N), V = u(T, U, D, N);
C = R;
j = B;
R = v;
B = I;
v = m;
I = y;
m = d(l, p, K, Y);
y = u(p, p, K, Y);
l = o;
p = c;
o = s;
c = f;
s = i;
f = n;
i = d(K, Y, W, V);
n = u(K, Y, W, V);
}
h(this.h, 0, i, n);
h(this.h, 2, s, f);
h(this.h, 4, o, c);
h(this.h, 6, l, p);
h(this.h, 8, m, y);
h(this.h, 10, v, I);
h(this.h, 12, R, B);
h(this.h, 14, C, j);
};
v.prototype._digest = function(e) {
return "hex" === e ? i.toHex32(this.h, "big") : i.split32(this.h, "big");
};
function _(e, t, r, i, n) {
var a = e & r ^ ~e & n;
a < 0 && (a += 4294967296);
return a;
}
function w(e, t, r, i, n, a) {
var s = t & i ^ ~t & a;
s < 0 && (s += 4294967296);
return s;
}
function S(e, t, r, i, n) {
var a = e & r ^ e & n ^ r & n;
a < 0 && (a += 4294967296);
return a;
}
function E(e, t, r, i, n, a) {
var s = t & i ^ t & a ^ i & a;
s < 0 && (s += 4294967296);
return s;
}
function M(e, t) {
var r = s(e, t, 28) ^ s(t, e, 2) ^ s(t, e, 7);
r < 0 && (r += 4294967296);
return r;
}
function k(e, t) {
var r = f(e, t, 28) ^ f(t, e, 2) ^ f(t, e, 7);
r < 0 && (r += 4294967296);
return r;
}
function A(e, t) {
var r = s(e, t, 14) ^ s(e, t, 18) ^ s(t, e, 9);
r < 0 && (r += 4294967296);
return r;
}
function x(e, t) {
var r = f(e, t, 14) ^ f(e, t, 18) ^ f(t, e, 9);
r < 0 && (r += 4294967296);
return r;
}
function I(e, t) {
var r = s(e, t, 1) ^ s(e, t, 8) ^ o(e, t, 7);
r < 0 && (r += 4294967296);
return r;
}
function R(e, t) {
var r = f(e, t, 1) ^ f(e, t, 8) ^ c(e, t, 7);
r < 0 && (r += 4294967296);
return r;
}
function B(e, t) {
var r = s(e, t, 19) ^ s(t, e, 29) ^ o(e, t, 6);
r < 0 && (r += 4294967296);
return r;
}
function C(e, t) {
var r = f(e, t, 19) ^ f(t, e, 29) ^ c(e, t, 6);
r < 0 && (r += 4294967296);
return r;
}
}, {
"../common": 87,
"../utils": 97,
"minimalistic-assert": 105
} ],
96: [ function(e, t, r) {
"use strict";
var i = e("../utils").rotr32;
r.ft_1 = function(e, t, r, i) {
return 0 === e ? n(t, r, i) : 1 === e || 3 === e ? s(t, r, i) : 2 === e ? a(t, r, i) : void 0;
};
function n(e, t, r) {
return e & t ^ ~e & r;
}
r.ch32 = n;
function a(e, t, r) {
return e & t ^ e & r ^ t & r;
}
r.maj32 = a;
function s(e, t, r) {
return e ^ t ^ r;
}
r.p32 = s;
r.s0_256 = function(e) {
return i(e, 2) ^ i(e, 13) ^ i(e, 22);
};
r.s1_256 = function(e) {
return i(e, 6) ^ i(e, 11) ^ i(e, 25);
};
r.g0_256 = function(e) {
return i(e, 7) ^ i(e, 18) ^ e >>> 3;
};
r.g1_256 = function(e) {
return i(e, 17) ^ i(e, 19) ^ e >>> 10;
};
}, {
"../utils": 97
} ],
97: [ function(e, t, r) {
"use strict";
var i = e("minimalistic-assert"), n = e("inherits");
r.inherits = n;
r.toArray = function(e, t) {
if (Array.isArray(e)) return e.slice();
if (!e) return [];
var r = [];
if ("string" == typeof e) if (t) {
if ("hex" === t) {
(e = e.replace(/[^a-z0-9]+/gi, "")).length % 2 != 0 && (e = "0" + e);
for (i = 0; i < e.length; i += 2) r.push(parseInt(e[i] + e[i + 1], 16));
}
} else for (var i = 0; i < e.length; i++) {
var n = e.charCodeAt(i), a = n >> 8, s = 255 & n;
a ? r.push(a, s) : r.push(s);
} else for (i = 0; i < e.length; i++) r[i] = 0 | e[i];
return r;
};
r.toHex = function(e) {
for (var t = "", r = 0; r < e.length; r++) t += s(e[r].toString(16));
return t;
};
function a(e) {
return (e >>> 24 | e >>> 8 & 65280 | e << 8 & 16711680 | (255 & e) << 24) >>> 0;
}
r.htonl = a;
r.toHex32 = function(e, t) {
for (var r = "", i = 0; i < e.length; i++) {
var n = e[i];
"little" === t && (n = a(n));
r += f(n.toString(16));
}
return r;
};
function s(e) {
return 1 === e.length ? "0" + e : e;
}
r.zero2 = s;
function f(e) {
return 7 === e.length ? "0" + e : 6 === e.length ? "00" + e : 5 === e.length ? "000" + e : 4 === e.length ? "0000" + e : 3 === e.length ? "00000" + e : 2 === e.length ? "000000" + e : 1 === e.length ? "0000000" + e : e;
}
r.zero8 = f;
r.join32 = function(e, t, r, n) {
var a = r - t;
i(a % 4 == 0);
for (var s = new Array(a / 4), f = 0, o = t; f < s.length; f++, o += 4) {
var c;
c = "big" === n ? e[o] << 24 | e[o + 1] << 16 | e[o + 2] << 8 | e[o + 3] : e[o + 3] << 24 | e[o + 2] << 16 | e[o + 1] << 8 | e[o];
s[f] = c >>> 0;
}
return s;
};
r.split32 = function(e, t) {
for (var r = new Array(4 * e.length), i = 0, n = 0; i < e.length; i++, n += 4) {
var a = e[i];
if ("big" === t) {
r[n] = a >>> 24;
r[n + 1] = a >>> 16 & 255;
r[n + 2] = a >>> 8 & 255;
r[n + 3] = 255 & a;
} else {
r[n + 3] = a >>> 24;
r[n + 2] = a >>> 16 & 255;
r[n + 1] = a >>> 8 & 255;
r[n] = 255 & a;
}
}
return r;
};
r.rotr32 = function(e, t) {
return e >>> t | e << 32 - t;
};
r.rotl32 = function(e, t) {
return e << t | e >>> 32 - t;
};
r.sum32 = function(e, t) {
return e + t >>> 0;
};
r.sum32_3 = function(e, t, r) {
return e + t + r >>> 0;
};
r.sum32_4 = function(e, t, r, i) {
return e + t + r + i >>> 0;
};
r.sum32_5 = function(e, t, r, i, n) {
return e + t + r + i + n >>> 0;
};
r.sum64 = function(e, t, r, i) {
var n = e[t], a = i + e[t + 1] >>> 0, s = (a < i ? 1 : 0) + r + n;
e[t] = s >>> 0;
e[t + 1] = a;
};
r.sum64_hi = function(e, t, r, i) {
return (t + i >>> 0 < t ? 1 : 0) + e + r >>> 0;
};
r.sum64_lo = function(e, t, r, i) {
return t + i >>> 0;
};
r.sum64_4_hi = function(e, t, r, i, n, a, s, f) {
var o = 0, c = t;
o += (c = c + i >>> 0) < t ? 1 : 0;
o += (c = c + a >>> 0) < a ? 1 : 0;
return e + r + n + s + (o += (c = c + f >>> 0) < f ? 1 : 0) >>> 0;
};
r.sum64_4_lo = function(e, t, r, i, n, a, s, f) {
return t + i + a + f >>> 0;
};
r.sum64_5_hi = function(e, t, r, i, n, a, s, f, o, c) {
var h = 0, d = t;
h += (d = d + i >>> 0) < t ? 1 : 0;
h += (d = d + a >>> 0) < a ? 1 : 0;
h += (d = d + f >>> 0) < f ? 1 : 0;
return e + r + n + s + o + (h += (d = d + c >>> 0) < c ? 1 : 0) >>> 0;
};
r.sum64_5_lo = function(e, t, r, i, n, a, s, f, o, c) {
return t + i + a + f + c >>> 0;
};
r.rotr64_hi = function(e, t, r) {
return (t << 32 - r | e >>> r) >>> 0;
};
r.rotr64_lo = function(e, t, r) {
return (e << 32 - r | t >>> r) >>> 0;
};
r.shr64_hi = function(e, t, r) {
return e >>> r;
};
r.shr64_lo = function(e, t, r) {
return (e << 32 - r | t >>> r) >>> 0;
};
}, {
inherits: 101,
"minimalistic-assert": 105
} ],
98: [ function(e, t, r) {
"use strict";
var i = e("hash.js"), n = e("minimalistic-crypto-utils"), a = e("minimalistic-assert");
function s(e) {
if (!(this instanceof s)) return new s(e);
this.hash = e.hash;
this.predResist = !!e.predResist;
this.outLen = this.hash.outSize;
this.minEntropy = e.minEntropy || this.hash.hmacStrength;
this._reseed = null;
this.reseedInterval = null;
this.K = null;
this.V = null;
var t = n.toArray(e.entropy, e.entropyEnc || "hex"), r = n.toArray(e.nonce, e.nonceEnc || "hex"), i = n.toArray(e.pers, e.persEnc || "hex");
a(t.length >= this.minEntropy / 8, "Not enough entropy. Minimum is: " + this.minEntropy + " bits");
this._init(t, r, i);
}
t.exports = s;
s.prototype._init = function(e, t, r) {
var i = e.concat(t).concat(r);
this.K = new Array(this.outLen / 8);
this.V = new Array(this.outLen / 8);
for (var n = 0; n < this.V.length; n++) {
this.K[n] = 0;
this.V[n] = 1;
}
this._update(i);
this._reseed = 1;
this.reseedInterval = 281474976710656;
};
s.prototype._hmac = function() {
return new i.hmac(this.hash, this.K);
};
s.prototype._update = function(e) {
var t = this._hmac().update(this.V).update([ 0 ]);
e && (t = t.update(e));
this.K = t.digest();
this.V = this._hmac().update(this.V).digest();
if (e) {
this.K = this._hmac().update(this.V).update([ 1 ]).update(e).digest();
this.V = this._hmac().update(this.V).digest();
}
};
s.prototype.reseed = function(e, t, r, i) {
if ("string" != typeof t) {
i = r;
r = t;
t = null;
}
e = n.toArray(e, t);
r = n.toArray(r, i);
a(e.length >= this.minEntropy / 8, "Not enough entropy. Minimum is: " + this.minEntropy + " bits");
this._update(e.concat(r || []));
this._reseed = 1;
};
s.prototype.generate = function(e, t, r, i) {
if (this._reseed > this.reseedInterval) throw new Error("Reseed is required");
if ("string" != typeof t) {
i = r;
r = t;
t = null;
}
if (r) {
r = n.toArray(r, i || "hex");
this._update(r);
}
for (var a = []; a.length < e; ) {
this.V = this._hmac().update(this.V).digest();
a = a.concat(this.V);
}
var s = a.slice(0, e);
this._update(r);
this._reseed++;
return n.encode(s, t);
};
}, {
"hash.js": 86,
"minimalistic-assert": 105,
"minimalistic-crypto-utils": 106
} ],
99: [ function(e, t, r) {
r.read = function(e, t, r, i, n) {
var a, s, f = 8 * n - i - 1, o = (1 << f) - 1, c = o >> 1, h = -7, d = r ? n - 1 : 0, u = r ? -1 : 1, l = e[t + d];
d += u;
a = l & (1 << -h) - 1;
l >>= -h;
h += f;
for (;h > 0; a = 256 * a + e[t + d], d += u, h -= 8) ;
s = a & (1 << -h) - 1;
a >>= -h;
h += i;
for (;h > 0; s = 256 * s + e[t + d], d += u, h -= 8) ;
if (0 === a) a = 1 - c; else {
if (a === o) return s ? NaN : Infinity * (l ? -1 : 1);
s += Math.pow(2, i);
a -= c;
}
return (l ? -1 : 1) * s * Math.pow(2, a - i);
};
r.write = function(e, t, r, i, n, a) {
var s, f, o, c = 8 * a - n - 1, h = (1 << c) - 1, d = h >> 1, u = 23 === n ? Math.pow(2, -24) - Math.pow(2, -77) : 0, l = i ? 0 : a - 1, p = i ? 1 : -1, b = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0;
t = Math.abs(t);
if (isNaN(t) || Infinity === t) {
f = isNaN(t) ? 1 : 0;
s = h;
} else {
s = Math.floor(Math.log(t) / Math.LN2);
if (t * (o = Math.pow(2, -s)) < 1) {
s--;
o *= 2;
}
if ((t += s + d >= 1 ? u / o : u * Math.pow(2, 1 - d)) * o >= 2) {
s++;
o /= 2;
}
if (s + d >= h) {
f = 0;
s = h;
} else if (s + d >= 1) {
f = (t * o - 1) * Math.pow(2, n);
s += d;
} else {
f = t * Math.pow(2, d - 1) * Math.pow(2, n);
s = 0;
}
}
for (;n >= 8; e[r + l] = 255 & f, l += p, f /= 256, n -= 8) ;
s = s << n | f;
c += n;
for (;c > 0; e[r + l] = 255 & s, l += p, s /= 256, c -= 8) ;
e[r + l - p] |= 128 * b;
};
}, {} ],
100: [ function(e, t, r) {
var i = [].indexOf;
t.exports = function(e, t) {
if (i) return e.indexOf(t);
for (var r = 0; r < e.length; ++r) if (e[r] === t) return r;
return -1;
};
}, {} ],
101: [ function(e, t, r) {
"function" == typeof Object.create ? t.exports = function(e, t) {
e.super_ = t;
e.prototype = Object.create(t.prototype, {
constructor: {
value: e,
enumerable: !1,
writable: !0,
configurable: !0
}
});
} : t.exports = function(e, t) {
e.super_ = t;
var r = function() {};
r.prototype = t.prototype;
e.prototype = new r();
e.prototype.constructor = e;
};
}, {} ],
102: [ function(e, t, r) {
t.exports = function(e) {
return null != e && (i(e) || function(e) {
return "function" == typeof e.readFloatLE && "function" == typeof e.slice && i(e.slice(0, 0));
}(e) || !!e._isBuffer);
};
function i(e) {
return !!e.constructor && "function" == typeof e.constructor.isBuffer && e.constructor.isBuffer(e);
}
}, {} ],
103: [ function(e, t, r) {
"use strict";
var i = e("inherits"), n = e("hash-base"), a = e("safe-buffer").Buffer, s = new Array(16);
function f() {
n.call(this, 64);
this._a = 1732584193;
this._b = 4023233417;
this._c = 2562383102;
this._d = 271733878;
}
i(f, n);
f.prototype._update = function() {
for (var e = s, t = 0; t < 16; ++t) e[t] = this._block.readInt32LE(4 * t);
var r = this._a, i = this._b, n = this._c, a = this._d;
i = u(i = u(i = u(i = u(i = d(i = d(i = d(i = d(i = h(i = h(i = h(i = h(i = c(i = c(i = c(i = c(i, n = c(n, a = c(a, r = c(r, i, n, a, e[0], 3614090360, 7), i, n, e[1], 3905402710, 12), r, i, e[2], 606105819, 17), a, r, e[3], 3250441966, 22), n = c(n, a = c(a, r = c(r, i, n, a, e[4], 4118548399, 7), i, n, e[5], 1200080426, 12), r, i, e[6], 2821735955, 17), a, r, e[7], 4249261313, 22), n = c(n, a = c(a, r = c(r, i, n, a, e[8], 1770035416, 7), i, n, e[9], 2336552879, 12), r, i, e[10], 4294925233, 17), a, r, e[11], 2304563134, 22), n = c(n, a = c(a, r = c(r, i, n, a, e[12], 1804603682, 7), i, n, e[13], 4254626195, 12), r, i, e[14], 2792965006, 17), a, r, e[15], 1236535329, 22), n = h(n, a = h(a, r = h(r, i, n, a, e[1], 4129170786, 5), i, n, e[6], 3225465664, 9), r, i, e[11], 643717713, 14), a, r, e[0], 3921069994, 20), n = h(n, a = h(a, r = h(r, i, n, a, e[5], 3593408605, 5), i, n, e[10], 38016083, 9), r, i, e[15], 3634488961, 14), a, r, e[4], 3889429448, 20), n = h(n, a = h(a, r = h(r, i, n, a, e[9], 568446438, 5), i, n, e[14], 3275163606, 9), r, i, e[3], 4107603335, 14), a, r, e[8], 1163531501, 20), n = h(n, a = h(a, r = h(r, i, n, a, e[13], 2850285829, 5), i, n, e[2], 4243563512, 9), r, i, e[7], 1735328473, 14), a, r, e[12], 2368359562, 20), n = d(n, a = d(a, r = d(r, i, n, a, e[5], 4294588738, 4), i, n, e[8], 2272392833, 11), r, i, e[11], 1839030562, 16), a, r, e[14], 4259657740, 23), n = d(n, a = d(a, r = d(r, i, n, a, e[1], 2763975236, 4), i, n, e[4], 1272893353, 11), r, i, e[7], 4139469664, 16), a, r, e[10], 3200236656, 23), n = d(n, a = d(a, r = d(r, i, n, a, e[13], 681279174, 4), i, n, e[0], 3936430074, 11), r, i, e[3], 3572445317, 16), a, r, e[6], 76029189, 23), n = d(n, a = d(a, r = d(r, i, n, a, e[9], 3654602809, 4), i, n, e[12], 3873151461, 11), r, i, e[15], 530742520, 16), a, r, e[2], 3299628645, 23), n = u(n, a = u(a, r = u(r, i, n, a, e[0], 4096336452, 6), i, n, e[7], 1126891415, 10), r, i, e[14], 2878612391, 15), a, r, e[5], 4237533241, 21), n = u(n, a = u(a, r = u(r, i, n, a, e[12], 1700485571, 6), i, n, e[3], 2399980690, 10), r, i, e[10], 4293915773, 15), a, r, e[1], 2240044497, 21), n = u(n, a = u(a, r = u(r, i, n, a, e[8], 1873313359, 6), i, n, e[15], 4264355552, 10), r, i, e[6], 2734768916, 15), a, r, e[13], 1309151649, 21), n = u(n, a = u(a, r = u(r, i, n, a, e[4], 4149444226, 6), i, n, e[11], 3174756917, 10), r, i, e[2], 718787259, 15), a, r, e[9], 3951481745, 21);
this._a = this._a + r | 0;
this._b = this._b + i | 0;
this._c = this._c + n | 0;
this._d = this._d + a | 0;
};
f.prototype._digest = function() {
this._block[this._blockOffset++] = 128;
if (this._blockOffset > 56) {
this._block.fill(0, this._blockOffset, 64);
this._update();
this._blockOffset = 0;
}
this._block.fill(0, this._blockOffset, 56);
this._block.writeUInt32LE(this._length[0], 56);
this._block.writeUInt32LE(this._length[1], 60);
this._update();
var e = a.allocUnsafe(16);
e.writeInt32LE(this._a, 0);
e.writeInt32LE(this._b, 4);
e.writeInt32LE(this._c, 8);
e.writeInt32LE(this._d, 12);
return e;
};
function o(e, t) {
return e << t | e >>> 32 - t;
}
function c(e, t, r, i, n, a, s) {
return o(e + (t & r | ~t & i) + n + a | 0, s) + t | 0;
}
function h(e, t, r, i, n, a, s) {
return o(e + (t & i | r & ~i) + n + a | 0, s) + t | 0;
}
function d(e, t, r, i, n, a, s) {
return o(e + (t ^ r ^ i) + n + a | 0, s) + t | 0;
}
function u(e, t, r, i, n, a, s) {
return o(e + (r ^ (t | ~i)) + n + a | 0, s) + t | 0;
}
t.exports = f;
}, {
"hash-base": 85,
inherits: 101,
"safe-buffer": 143
} ],
104: [ function(e, t, r) {
var i = e("bn.js"), n = e("brorand");
function a(e) {
this.rand = e || new n.Rand();
}
t.exports = a;
a.create = function(e) {
return new a(e);
};
a.prototype._randbelow = function(e) {
var t = e.bitLength(), r = Math.ceil(t / 8);
do {
var n = new i(this.rand.generate(r));
} while (n.cmp(e) >= 0);
return n;
};
a.prototype._randrange = function(e, t) {
var r = t.sub(e);
return e.add(this._randbelow(r));
};
a.prototype.test = function(e, t, r) {
var n = e.bitLength(), a = i.mont(e), s = new i(1).toRed(a);
t || (t = Math.max(1, n / 48 | 0));
for (var f = e.subn(1), o = 0; !f.testn(o); o++) ;
for (var c = e.shrn(o), h = f.toRed(a); t > 0; t--) {
var d = this._randrange(new i(2), f);
r && r(d);
var u = d.toRed(a).redPow(c);
if (0 !== u.cmp(s) && 0 !== u.cmp(h)) {
for (var l = 1; l < o; l++) {
if (0 === (u = u.redSqr()).cmp(s)) return !1;
if (0 === u.cmp(h)) break;
}
if (l === o) return !1;
}
}
return !0;
};
a.prototype.getDivisor = function(e, t) {
var r = e.bitLength(), n = i.mont(e), a = new i(1).toRed(n);
t || (t = Math.max(1, r / 48 | 0));
for (var s = e.subn(1), f = 0; !s.testn(f); f++) ;
for (var o = e.shrn(f), c = s.toRed(n); t > 0; t--) {
var h = this._randrange(new i(2), s), d = e.gcd(h);
if (0 !== d.cmpn(1)) return d;
var u = h.toRed(n).redPow(o);
if (0 !== u.cmp(a) && 0 !== u.cmp(c)) {
for (var l = 1; l < f; l++) {
if (0 === (u = u.redSqr()).cmp(a)) return u.fromRed().subn(1).gcd(e);
if (0 === u.cmp(c)) break;
}
if (l === f) return (u = u.redSqr()).fromRed().subn(1).gcd(e);
}
}
return !1;
};
}, {
"bn.js": 16,
brorand: 17
} ],
105: [ function(e, t, r) {
t.exports = i;
function i(e, t) {
if (!e) throw new Error(t || "Assertion failed");
}
i.equal = function(e, t, r) {
if (e != t) throw new Error(r || "Assertion failed: " + e + " != " + t);
};
}, {} ],
106: [ function(e, t, r) {
"use strict";
var i = r;
i.toArray = function(e, t) {
if (Array.isArray(e)) return e.slice();
if (!e) return [];
var r = [];
if ("string" != typeof e) {
for (var i = 0; i < e.length; i++) r[i] = 0 | e[i];
return r;
}
if ("hex" === t) {
(e = e.replace(/[^a-z0-9]+/gi, "")).length % 2 != 0 && (e = "0" + e);
for (i = 0; i < e.length; i += 2) r.push(parseInt(e[i] + e[i + 1], 16));
} else for (i = 0; i < e.length; i++) {
var n = e.charCodeAt(i), a = n >> 8, s = 255 & n;
a ? r.push(a, s) : r.push(s);
}
return r;
};
function n(e) {
return 1 === e.length ? "0" + e : e;
}
i.zero2 = n;
function a(e) {
for (var t = "", r = 0; r < e.length; r++) t += n(e[r].toString(16));
return t;
}
i.toHex = a;
i.encode = function(e, t) {
return "hex" === t ? a(e) : e;
};
}, {} ],
107: [ function(e, t, r) {
t.exports = {
"2.16.840.1.101.3.4.1.1": "aes-128-ecb",
"2.16.840.1.101.3.4.1.2": "aes-128-cbc",
"2.16.840.1.101.3.4.1.3": "aes-128-ofb",
"2.16.840.1.101.3.4.1.4": "aes-128-cfb",
"2.16.840.1.101.3.4.1.21": "aes-192-ecb",
"2.16.840.1.101.3.4.1.22": "aes-192-cbc",
"2.16.840.1.101.3.4.1.23": "aes-192-ofb",
"2.16.840.1.101.3.4.1.24": "aes-192-cfb",
"2.16.840.1.101.3.4.1.41": "aes-256-ecb",
"2.16.840.1.101.3.4.1.42": "aes-256-cbc",
"2.16.840.1.101.3.4.1.43": "aes-256-ofb",
"2.16.840.1.101.3.4.1.44": "aes-256-cfb"
};
}, {} ],
108: [ function(e, t, r) {
"use strict";
var i = e("asn1.js");
r.certificate = e("./certificate");
var n = i.define("RSAPrivateKey", function() {
this.seq().obj(this.key("version").int(), this.key("modulus").int(), this.key("publicExponent").int(), this.key("privateExponent").int(), this.key("prime1").int(), this.key("prime2").int(), this.key("exponent1").int(), this.key("exponent2").int(), this.key("coefficient").int());
});
r.RSAPrivateKey = n;
var a = i.define("RSAPublicKey", function() {
this.seq().obj(this.key("modulus").int(), this.key("publicExponent").int());
});
r.RSAPublicKey = a;
var s = i.define("SubjectPublicKeyInfo", function() {
this.seq().obj(this.key("algorithm").use(f), this.key("subjectPublicKey").bitstr());
});
r.PublicKey = s;
var f = i.define("AlgorithmIdentifier", function() {
this.seq().obj(this.key("algorithm").objid(), this.key("none").null_().optional(), this.key("curve").objid().optional(), this.key("params").seq().obj(this.key("p").int(), this.key("q").int(), this.key("g").int()).optional());
}), o = i.define("PrivateKeyInfo", function() {
this.seq().obj(this.key("version").int(), this.key("algorithm").use(f), this.key("subjectPrivateKey").octstr());
});
r.PrivateKey = o;
var c = i.define("EncryptedPrivateKeyInfo", function() {
this.seq().obj(this.key("algorithm").seq().obj(this.key("id").objid(), this.key("decrypt").seq().obj(this.key("kde").seq().obj(this.key("id").objid(), this.key("kdeparams").seq().obj(this.key("salt").octstr(), this.key("iters").int())), this.key("cipher").seq().obj(this.key("algo").objid(), this.key("iv").octstr()))), this.key("subjectPrivateKey").octstr());
});
r.EncryptedPrivateKey = c;
var h = i.define("DSAPrivateKey", function() {
this.seq().obj(this.key("version").int(), this.key("p").int(), this.key("q").int(), this.key("g").int(), this.key("pub_key").int(), this.key("priv_key").int());
});
r.DSAPrivateKey = h;
r.DSAparam = i.define("DSAparam", function() {
this.int();
});
var d = i.define("ECPrivateKey", function() {
this.seq().obj(this.key("version").int(), this.key("privateKey").octstr(), this.key("parameters").optional().explicit(0).use(u), this.key("publicKey").optional().explicit(1).bitstr());
});
r.ECPrivateKey = d;
var u = i.define("ECParameters", function() {
this.choice({
namedCurve: this.objid()
});
});
r.signature = i.define("signature", function() {
this.seq().obj(this.key("r").int(), this.key("s").int());
});
}, {
"./certificate": 109,
"asn1.js": 1
} ],
109: [ function(e, t, r) {
"use strict";
var i = e("asn1.js"), n = i.define("Time", function() {
this.choice({
utcTime: this.utctime(),
generalTime: this.gentime()
});
}), a = i.define("AttributeTypeValue", function() {
this.seq().obj(this.key("type").objid(), this.key("value").any());
}), s = i.define("AlgorithmIdentifier", function() {
this.seq().obj(this.key("algorithm").objid(), this.key("parameters").optional());
}), f = i.define("SubjectPublicKeyInfo", function() {
this.seq().obj(this.key("algorithm").use(s), this.key("subjectPublicKey").bitstr());
}), o = i.define("RelativeDistinguishedName", function() {
this.setof(a);
}), c = i.define("RDNSequence", function() {
this.seqof(o);
}), h = i.define("Name", function() {
this.choice({
rdnSequence: this.use(c)
});
}), d = i.define("Validity", function() {
this.seq().obj(this.key("notBefore").use(n), this.key("notAfter").use(n));
}), u = i.define("Extension", function() {
this.seq().obj(this.key("extnID").objid(), this.key("critical").bool().def(!1), this.key("extnValue").octstr());
}), l = i.define("TBSCertificate", function() {
this.seq().obj(this.key("version").explicit(0).int(), this.key("serialNumber").int(), this.key("signature").use(s), this.key("issuer").use(h), this.key("validity").use(d), this.key("subject").use(h), this.key("subjectPublicKeyInfo").use(f), this.key("issuerUniqueID").implicit(1).bitstr().optional(), this.key("subjectUniqueID").implicit(2).bitstr().optional(), this.key("extensions").explicit(3).seqof(u).optional());
}), p = i.define("X509Certificate", function() {
this.seq().obj(this.key("tbsCertificate").use(l), this.key("signatureAlgorithm").use(s), this.key("signatureValue").bitstr());
});
t.exports = p;
}, {
"asn1.js": 1
} ],
110: [ function(e, t, r) {
(function(r) {
var i = /Proc-Type: 4,ENCRYPTED[\n\r]+DEK-Info: AES-((?:128)|(?:192)|(?:256))-CBC,([0-9A-H]+)[\n\r]+([0-9A-z\n\r\+\/\=]+)[\n\r]+/m, n = /^-----BEGIN ((?:.* KEY)|CERTIFICATE)-----/m, a = /^-----BEGIN ((?:.* KEY)|CERTIFICATE)-----([0-9A-z\n\r\+\/\=]+)-----END \1-----$/m, s = e("evp_bytestokey"), f = e("browserify-aes");
t.exports = function(e, t) {
var o, c = e.toString(), h = c.match(i);
if (h) {
var d = "aes" + h[1], u = new r(h[2], "hex"), l = new r(h[3].replace(/[\r\n]/g, ""), "base64"), p = s(t, u.slice(0, 8), parseInt(h[1], 10)).key, b = [], g = f.createDecipheriv(d, p, u);
b.push(g.update(l));
b.push(g.final());
o = r.concat(b);
} else {
var m = c.match(a);
o = new r(m[2].replace(/[\r\n]/g, ""), "base64");
}
return {
tag: c.match(n)[1],
data: o
};
};
}).call(this, e("buffer").Buffer);
}, {
"browserify-aes": 21,
buffer: 47,
evp_bytestokey: 84
} ],
111: [ function(e, t, r) {
(function(r) {
var i = e("./asn1"), n = e("./aesid.json"), a = e("./fixProc"), s = e("browserify-aes"), f = e("pbkdf2");
t.exports = o;
function o(e) {
var t;
if ("object" == typeof e && !r.isBuffer(e)) {
t = e.passphrase;
e = e.key;
}
"string" == typeof e && (e = new r(e));
var o, c, h = a(e, t), d = h.tag, u = h.data;
switch (d) {
case "CERTIFICATE":
c = i.certificate.decode(u, "der").tbsCertificate.subjectPublicKeyInfo;

case "PUBLIC KEY":
c || (c = i.PublicKey.decode(u, "der"));
switch (o = c.algorithm.algorithm.join(".")) {
case "1.2.840.113549.1.1.1":
return i.RSAPublicKey.decode(c.subjectPublicKey.data, "der");

case "1.2.840.10045.2.1":
c.subjectPrivateKey = c.subjectPublicKey;
return {
type: "ec",
data: c
};

case "1.2.840.10040.4.1":
c.algorithm.params.pub_key = i.DSAparam.decode(c.subjectPublicKey.data, "der");
return {
type: "dsa",
data: c.algorithm.params
};

default:
throw new Error("unknown key id " + o);
}
throw new Error("unknown key type " + d);

case "ENCRYPTED PRIVATE KEY":
u = function(e, t) {
var i = e.algorithm.decrypt.kde.kdeparams.salt, a = parseInt(e.algorithm.decrypt.kde.kdeparams.iters.toString(), 10), o = n[e.algorithm.decrypt.cipher.algo.join(".")], c = e.algorithm.decrypt.cipher.iv, h = e.subjectPrivateKey, d = parseInt(o.split("-")[1], 10) / 8, u = f.pbkdf2Sync(t, i, a, d), l = s.createDecipheriv(o, u, c), p = [];
p.push(l.update(h));
p.push(l.final());
return r.concat(p);
}(u = i.EncryptedPrivateKey.decode(u, "der"), t);

case "PRIVATE KEY":
switch (o = (c = i.PrivateKey.decode(u, "der")).algorithm.algorithm.join(".")) {
case "1.2.840.113549.1.1.1":
return i.RSAPrivateKey.decode(c.subjectPrivateKey, "der");

case "1.2.840.10045.2.1":
return {
curve: c.algorithm.curve,
privateKey: i.ECPrivateKey.decode(c.subjectPrivateKey, "der").privateKey
};

case "1.2.840.10040.4.1":
c.algorithm.params.priv_key = i.DSAparam.decode(c.subjectPrivateKey, "der");
return {
type: "dsa",
params: c.algorithm.params
};

default:
throw new Error("unknown key id " + o);
}
throw new Error("unknown key type " + d);

case "RSA PUBLIC KEY":
return i.RSAPublicKey.decode(u, "der");

case "RSA PRIVATE KEY":
return i.RSAPrivateKey.decode(u, "der");

case "DSA PRIVATE KEY":
return {
type: "dsa",
params: i.DSAPrivateKey.decode(u, "der")
};

case "EC PRIVATE KEY":
return {
curve: (u = i.ECPrivateKey.decode(u, "der")).parameters.value,
privateKey: u.privateKey
};

default:
throw new Error("unknown key type " + d);
}
}
o.signature = i.signature;
}).call(this, e("buffer").Buffer);
}, {
"./aesid.json": 107,
"./asn1": 108,
"./fixProc": 110,
"browserify-aes": 21,
buffer: 47,
pbkdf2: 112
} ],
112: [ function(e, t, r) {
r.pbkdf2 = e("./lib/async");
r.pbkdf2Sync = e("./lib/sync");
}, {
"./lib/async": 113,
"./lib/sync": 116
} ],
113: [ function(e, t, r) {
(function(r, i) {
var n, a = e("./precondition"), s = e("./default-encoding"), f = e("./sync"), o = e("safe-buffer").Buffer, c = i.crypto && i.crypto.subtle, h = {
sha: "SHA-1",
"sha-1": "SHA-1",
sha1: "SHA-1",
sha256: "SHA-256",
"sha-256": "SHA-256",
sha384: "SHA-384",
"sha-384": "SHA-384",
"sha-512": "SHA-512",
sha512: "SHA-512"
}, d = [];
function u(e, t, r, i, n) {
return c.importKey("raw", e, {
name: "PBKDF2"
}, !1, [ "deriveBits" ]).then(function(e) {
return c.deriveBits({
name: "PBKDF2",
salt: t,
iterations: r,
hash: {
name: n
}
}, e, i << 3);
}).then(function(e) {
return o.from(e);
});
}
t.exports = function(e, t, l, p, b, g) {
if ("function" == typeof b) {
g = b;
b = void 0;
}
var m = h[(b = b || "sha1").toLowerCase()];
if (!m || "function" != typeof i.Promise) return r.nextTick(function() {
var r;
try {
r = f(e, t, l, p, b);
} catch (e) {
return g(e);
}
g(null, r);
});
a(e, t, l, p);
if ("function" != typeof g) throw new Error("No callback provided to pbkdf2");
o.isBuffer(e) || (e = o.from(e, s));
o.isBuffer(t) || (t = o.from(t, s));
(function(e, t) {
e.then(function(e) {
r.nextTick(function() {
t(null, e);
});
}, function(e) {
r.nextTick(function() {
t(e);
});
});
})(function(e) {
if (i.process && !i.process.browser) return Promise.resolve(!1);
if (!c || !c.importKey || !c.deriveBits) return Promise.resolve(!1);
if (void 0 !== d[e]) return d[e];
var t = u(n = n || o.alloc(8), n, 10, 128, e).then(function() {
return !0;
}).catch(function() {
return !1;
});
d[e] = t;
return t;
}(m).then(function(r) {
return r ? u(e, t, l, p, m) : f(e, t, l, p, b);
}), g);
};
}).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
}, {
"./default-encoding": 114,
"./precondition": 115,
"./sync": 116,
_process: 118,
"safe-buffer": 143
} ],
114: [ function(e, t, r) {
(function(e) {
var r;
if (e.browser) r = "utf-8"; else {
r = parseInt(e.version.split(".")[0].slice(1), 10) >= 6 ? "utf-8" : "binary";
}
t.exports = r;
}).call(this, e("_process"));
}, {
_process: 118
} ],
115: [ function(e, t, r) {
(function(e) {
var r = Math.pow(2, 30) - 1;
function i(t, r) {
if ("string" != typeof t && !e.isBuffer(t)) throw new TypeError(r + " must be a buffer or string");
}
t.exports = function(e, t, n, a) {
i(e, "Password");
i(t, "Salt");
if ("number" != typeof n) throw new TypeError("Iterations not a number");
if (n < 0) throw new TypeError("Bad iterations");
if ("number" != typeof a) throw new TypeError("Key length not a number");
if (a < 0 || a > r || a != a) throw new TypeError("Bad key length");
};
}).call(this, {
isBuffer: e("../../is-buffer/index.js")
});
}, {
"../../is-buffer/index.js": 102
} ],
116: [ function(e, t, r) {
var i = e("create-hash/md5"), n = e("ripemd160"), a = e("sha.js"), s = e("./precondition"), f = e("./default-encoding"), o = e("safe-buffer").Buffer, c = o.alloc(128), h = {
md5: 16,
sha1: 20,
sha224: 28,
sha256: 32,
sha384: 48,
sha512: 64,
rmd160: 20,
ripemd160: 20
};
function d(e, t, r) {
var s = function(e) {
return "rmd160" === e || "ripemd160" === e ? function(e) {
return new n().update(e).digest();
} : "md5" === e ? i : function(t) {
return a(e).update(t).digest();
};
}(e), f = "sha512" === e || "sha384" === e ? 128 : 64;
t.length > f ? t = s(t) : t.length < f && (t = o.concat([ t, c ], f));
for (var d = o.allocUnsafe(f + h[e]), u = o.allocUnsafe(f + h[e]), l = 0; l < f; l++) {
d[l] = 54 ^ t[l];
u[l] = 92 ^ t[l];
}
var p = o.allocUnsafe(f + r + 4);
d.copy(p, 0, 0, f);
this.ipad1 = p;
this.ipad2 = d;
this.opad = u;
this.alg = e;
this.blocksize = f;
this.hash = s;
this.size = h[e];
}
d.prototype.run = function(e, t) {
e.copy(t, this.blocksize);
this.hash(t).copy(this.opad, this.blocksize);
return this.hash(this.opad);
};
t.exports = function(e, t, r, i, n) {
s(e, t, r, i);
o.isBuffer(e) || (e = o.from(e, f));
o.isBuffer(t) || (t = o.from(t, f));
var a = new d(n = n || "sha1", e, t.length), c = o.allocUnsafe(i), u = o.allocUnsafe(t.length + 4);
t.copy(u, 0, 0, t.length);
for (var l = 0, p = h[n], b = Math.ceil(i / p), g = 1; g <= b; g++) {
u.writeUInt32BE(g, t.length);
for (var m = a.run(u, a.ipad1), y = m, v = 1; v < r; v++) {
y = a.run(y, a.ipad2);
for (var _ = 0; _ < p; _++) m[_] ^= y[_];
}
m.copy(c, l);
l += p;
}
return c;
};
}, {
"./default-encoding": 114,
"./precondition": 115,
"create-hash/md5": 53,
ripemd160: 142,
"safe-buffer": 143,
"sha.js": 145
} ],
117: [ function(e, t, r) {
(function(e) {
"use strict";
!e.version || 0 === e.version.indexOf("v0.") || 0 === e.version.indexOf("v1.") && 0 !== e.version.indexOf("v1.8.") ? t.exports = {
nextTick: function(t, r, i, n) {
if ("function" != typeof t) throw new TypeError('"callback" argument must be a function');
var a, s, f = arguments.length;
switch (f) {
case 0:
case 1:
return e.nextTick(t);

case 2:
return e.nextTick(function() {
t.call(null, r);
});

case 3:
return e.nextTick(function() {
t.call(null, r, i);
});

case 4:
return e.nextTick(function() {
t.call(null, r, i, n);
});

default:
a = new Array(f - 1);
s = 0;
for (;s < a.length; ) a[s++] = arguments[s];
return e.nextTick(function() {
t.apply(null, a);
});
}
}
} : t.exports = e;
}).call(this, e("_process"));
}, {
_process: 118
} ],
118: [ function(e, t, r) {
var i, n, a = t.exports = {};
function s() {
throw new Error("setTimeout has not been defined");
}
function f() {
throw new Error("clearTimeout has not been defined");
}
(function() {
try {
i = "function" == typeof setTimeout ? setTimeout : s;
} catch (e) {
i = s;
}
try {
n = "function" == typeof clearTimeout ? clearTimeout : f;
} catch (e) {
n = f;
}
})();
function o(e) {
if (i === setTimeout) return setTimeout(e, 0);
if ((i === s || !i) && setTimeout) {
i = setTimeout;
return setTimeout(e, 0);
}
try {
return i(e, 0);
} catch (t) {
try {
return i.call(null, e, 0);
} catch (t) {
return i.call(this, e, 0);
}
}
}
var c, h = [], d = !1, u = -1;
function l() {
if (d && c) {
d = !1;
c.length ? h = c.concat(h) : u = -1;
h.length && p();
}
}
function p() {
if (!d) {
var e = o(l);
d = !0;
for (var t = h.length; t; ) {
c = h;
h = [];
for (;++u < t; ) c && c[u].run();
u = -1;
t = h.length;
}
c = null;
d = !1;
(function(e) {
if (n === clearTimeout) return clearTimeout(e);
if ((n === f || !n) && clearTimeout) {
n = clearTimeout;
return clearTimeout(e);
}
try {
n(e);
} catch (t) {
try {
return n.call(null, e);
} catch (t) {
return n.call(this, e);
}
}
})(e);
}
}
a.nextTick = function(e) {
var t = new Array(arguments.length - 1);
if (arguments.length > 1) for (var r = 1; r < arguments.length; r++) t[r - 1] = arguments[r];
h.push(new b(e, t));
1 !== h.length || d || o(p);
};
function b(e, t) {
this.fun = e;
this.array = t;
}
b.prototype.run = function() {
this.fun.apply(null, this.array);
};
a.title = "browser";
a.browser = !0;
a.env = {};
a.argv = [];
a.version = "";
a.versions = {};
function g() {}
a.on = g;
a.addListener = g;
a.once = g;
a.off = g;
a.removeListener = g;
a.removeAllListeners = g;
a.emit = g;
a.prependListener = g;
a.prependOnceListener = g;
a.listeners = function(e) {
return [];
};
a.binding = function(e) {
throw new Error("process.binding is not supported");
};
a.cwd = function() {
return "/";
};
a.chdir = function(e) {
throw new Error("process.chdir is not supported");
};
a.umask = function() {
return 0;
};
}, {} ],
119: [ function(e, t, r) {
r.publicEncrypt = e("./publicEncrypt");
r.privateDecrypt = e("./privateDecrypt");
r.privateEncrypt = function(e, t) {
return r.publicEncrypt(e, t, !0);
};
r.publicDecrypt = function(e, t) {
return r.privateDecrypt(e, t, !0);
};
}, {
"./privateDecrypt": 121,
"./publicEncrypt": 122
} ],
120: [ function(e, t, r) {
var i = e("create-hash"), n = e("safe-buffer").Buffer;
t.exports = function(e, t) {
for (var r, s = n.alloc(0), f = 0; s.length < t; ) {
r = a(f++);
s = n.concat([ s, i("sha1").update(e).update(r).digest() ]);
}
return s.slice(0, t);
};
function a(e) {
var t = n.allocUnsafe(4);
t.writeUInt32BE(e, 0);
return t;
}
}, {
"create-hash": 52,
"safe-buffer": 143
} ],
121: [ function(e, t, r) {
var i = e("parse-asn1"), n = e("./mgf"), a = e("./xor"), s = e("bn.js"), f = e("browserify-rsa"), o = e("create-hash"), c = e("./withPublic"), h = e("safe-buffer").Buffer;
t.exports = function(e, t, r) {
var d;
d = e.padding ? e.padding : r ? 1 : 4;
var u, l = i(e), p = l.modulus.byteLength();
if (t.length > p || new s(t).cmp(l.modulus) >= 0) throw new Error("decryption error");
u = r ? c(new s(t), l) : f(t, l);
var b = h.alloc(p - u.length);
u = h.concat([ b, u ], p);
if (4 === d) return function(e, t) {
var r = e.modulus.byteLength(), i = o("sha1").update(h.alloc(0)).digest(), s = i.length;
if (0 !== t[0]) throw new Error("decryption error");
var f = t.slice(1, s + 1), c = t.slice(s + 1), d = a(f, n(c, s)), u = a(c, n(d, r - s - 1));
if (function(e, t) {
e = h.from(e);
t = h.from(t);
var r = 0, i = e.length;
if (e.length !== t.length) {
r++;
i = Math.min(e.length, t.length);
}
var n = -1;
for (;++n < i; ) r += e[n] ^ t[n];
return r;
}(i, u.slice(0, s))) throw new Error("decryption error");
var l = s;
for (;0 === u[l]; ) l++;
if (1 !== u[l++]) throw new Error("decryption error");
return u.slice(l);
}(l, u);
if (1 === d) return function(e, t, r) {
var i = t.slice(0, 2), n = 2, a = 0;
for (;0 !== t[n++]; ) if (n >= t.length) {
a++;
break;
}
var s = t.slice(2, n - 1);
("0002" !== i.toString("hex") && !r || "0001" !== i.toString("hex") && r) && a++;
s.length < 8 && a++;
if (a) throw new Error("decryption error");
return t.slice(n);
}(0, u, r);
if (3 === d) return u;
throw new Error("unknown padding");
};
}, {
"./mgf": 120,
"./withPublic": 123,
"./xor": 124,
"bn.js": 16,
"browserify-rsa": 39,
"create-hash": 52,
"parse-asn1": 111,
"safe-buffer": 143
} ],
122: [ function(e, t, r) {
var i = e("parse-asn1"), n = e("randombytes"), a = e("create-hash"), s = e("./mgf"), f = e("./xor"), o = e("bn.js"), c = e("./withPublic"), h = e("browserify-rsa"), d = e("safe-buffer").Buffer;
t.exports = function(e, t, r) {
var u;
u = e.padding ? e.padding : r ? 1 : 4;
var l, p = i(e);
if (4 === u) l = function(e, t) {
var r = e.modulus.byteLength(), i = t.length, c = a("sha1").update(d.alloc(0)).digest(), h = c.length, u = 2 * h;
if (i > r - u - 2) throw new Error("message too long");
var l = d.alloc(r - i - u - 2), p = r - h - 1, b = n(h), g = f(d.concat([ c, l, d.alloc(1, 1), t ], p), s(b, p)), m = f(b, s(g, h));
return new o(d.concat([ d.alloc(1), m, g ], r));
}(p, t); else if (1 === u) l = function(e, t, r) {
var i, a = t.length, s = e.modulus.byteLength();
if (a > s - 11) throw new Error("message too long");
i = r ? d.alloc(s - a - 3, 255) : function(e) {
var t, r = d.allocUnsafe(e), i = 0, a = n(2 * e), s = 0;
for (;i < e; ) {
if (s === a.length) {
a = n(2 * e);
s = 0;
}
(t = a[s++]) && (r[i++] = t);
}
return r;
}(s - a - 3);
return new o(d.concat([ d.from([ 0, r ? 1 : 2 ]), i, d.alloc(1), t ], s));
}(p, t, r); else {
if (3 !== u) throw new Error("unknown padding");
if ((l = new o(t)).cmp(p.modulus) >= 0) throw new Error("data too long for modulus");
}
return r ? h(l, p) : c(l, p);
};
}, {
"./mgf": 120,
"./withPublic": 123,
"./xor": 124,
"bn.js": 16,
"browserify-rsa": 39,
"create-hash": 52,
"parse-asn1": 111,
randombytes: 125,
"safe-buffer": 143
} ],
123: [ function(e, t, r) {
var i = e("bn.js"), n = e("safe-buffer").Buffer;
t.exports = function(e, t) {
return n.from(e.toRed(i.mont(t.modulus)).redPow(new i(t.publicExponent)).fromRed().toArray());
};
}, {
"bn.js": 16,
"safe-buffer": 143
} ],
124: [ function(e, t, r) {
t.exports = function(e, t) {
for (var r = e.length, i = -1; ++i < r; ) e[i] ^= t[i];
return e;
};
}, {} ],
125: [ function(e, t, r) {
(function(r, i) {
"use strict";
var n = e("safe-buffer").Buffer, a = i.crypto || i.msCrypto;
a && a.getRandomValues ? t.exports = function(e, t) {
if (e > 65536) throw new Error("requested too many random bytes");
var s = new i.Uint8Array(e);
e > 0 && a.getRandomValues(s);
var f = n.from(s.buffer);
if ("function" == typeof t) return r.nextTick(function() {
t(null, f);
});
return f;
} : t.exports = function() {
throw new Error("Secure random number generation is not supported by this browser.\nUse Chrome, Firefox or Internet Explorer 11");
};
}).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
}, {
_process: 118,
"safe-buffer": 143
} ],
126: [ function(e, t, r) {
(function(t, i) {
"use strict";
function n() {
throw new Error("secure random number generation not supported by this browser\nuse chrome, FireFox or Internet Explorer 11");
}
var a = e("safe-buffer"), s = e("randombytes"), f = a.Buffer, o = a.kMaxLength, c = i.crypto || i.msCrypto, h = Math.pow(2, 32) - 1;
function d(e, t) {
if ("number" != typeof e || e != e) throw new TypeError("offset must be a number");
if (e > h || e < 0) throw new TypeError("offset must be a uint32");
if (e > o || e > t) throw new RangeError("offset out of range");
}
function u(e, t, r) {
if ("number" != typeof e || e != e) throw new TypeError("size must be a number");
if (e > h || e < 0) throw new TypeError("size must be a uint32");
if (e + t > r || e > o) throw new RangeError("buffer too small");
}
if (c && c.getRandomValues || !t.browser) {
r.randomFill = function(e, t, r, n) {
if (!(f.isBuffer(e) || e instanceof i.Uint8Array)) throw new TypeError('"buf" argument must be a Buffer or Uint8Array');
if ("function" == typeof t) {
n = t;
t = 0;
r = e.length;
} else if ("function" == typeof r) {
n = r;
r = e.length - t;
} else if ("function" != typeof n) throw new TypeError('"cb" argument must be a function');
d(t, e.length);
u(r, t, e.length);
return l(e, t, r, n);
};
r.randomFillSync = function(e, t, r) {
"undefined" == typeof t && (t = 0);
if (!(f.isBuffer(e) || e instanceof i.Uint8Array)) throw new TypeError('"buf" argument must be a Buffer or Uint8Array');
d(t, e.length);
void 0 === r && (r = e.length - t);
u(r, t, e.length);
return l(e, t, r);
};
} else {
r.randomFill = n;
r.randomFillSync = n;
}
function l(e, r, i, n) {
if (t.browser) {
var a = e.buffer, f = new Uint8Array(a, r, i);
c.getRandomValues(f);
if (n) {
t.nextTick(function() {
n(null, e);
});
return;
}
return e;
}
if (!n) {
s(i).copy(e, r);
return e;
}
s(i, function(t, i) {
if (t) return n(t);
i.copy(e, r);
n(null, e);
});
}
}).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
}, {
_process: 118,
randombytes: 125,
"safe-buffer": 143
} ],
127: [ function(e, t, r) {
t.exports = e("./lib/_stream_duplex.js");
}, {
"./lib/_stream_duplex.js": 128
} ],
128: [ function(e, t, r) {
"use strict";
var i = e("process-nextick-args"), n = Object.keys || function(e) {
var t = [];
for (var r in e) t.push(r);
return t;
};
t.exports = d;
var a = e("core-util-is");
a.inherits = e("inherits");
var s = e("./_stream_readable"), f = e("./_stream_writable");
a.inherits(d, s);
for (var o = n(f.prototype), c = 0; c < o.length; c++) {
var h = o[c];
d.prototype[h] || (d.prototype[h] = f.prototype[h]);
}
function d(e) {
if (!(this instanceof d)) return new d(e);
s.call(this, e);
f.call(this, e);
e && !1 === e.readable && (this.readable = !1);
e && !1 === e.writable && (this.writable = !1);
this.allowHalfOpen = !0;
e && !1 === e.allowHalfOpen && (this.allowHalfOpen = !1);
this.once("end", u);
}
Object.defineProperty(d.prototype, "writableHighWaterMark", {
enumerable: !1,
get: function() {
return this._writableState.highWaterMark;
}
});
function u() {
this.allowHalfOpen || this._writableState.ended || i.nextTick(l, this);
}
function l(e) {
e.end();
}
Object.defineProperty(d.prototype, "destroyed", {
get: function() {
return void 0 !== this._readableState && void 0 !== this._writableState && (this._readableState.destroyed && this._writableState.destroyed);
},
set: function(e) {
if (void 0 !== this._readableState && void 0 !== this._writableState) {
this._readableState.destroyed = e;
this._writableState.destroyed = e;
}
}
});
d.prototype._destroy = function(e, t) {
this.push(null);
this.end();
i.nextTick(t, e);
};
}, {
"./_stream_readable": 130,
"./_stream_writable": 132,
"core-util-is": 50,
inherits: 101,
"process-nextick-args": 117
} ],
129: [ function(e, t, r) {
"use strict";
t.exports = a;
var i = e("./_stream_transform"), n = e("core-util-is");
n.inherits = e("inherits");
n.inherits(a, i);
function a(e) {
if (!(this instanceof a)) return new a(e);
i.call(this, e);
}
a.prototype._transform = function(e, t, r) {
r(null, e);
};
}, {
"./_stream_transform": 131,
"core-util-is": 50,
inherits: 101
} ],
130: [ function(e, t, r) {
(function(r, i) {
"use strict";
var n = e("process-nextick-args");
t.exports = v;
var a, s = e("isarray");
v.ReadableState = y;
e("events").EventEmitter;
var f = function(e, t) {
return e.listeners(t).length;
}, o = e("./internal/streams/stream"), c = e("safe-buffer").Buffer, h = i.Uint8Array || function() {};
var d = e("core-util-is");
d.inherits = e("inherits");
var u = e("util"), l = void 0;
l = u && u.debuglog ? u.debuglog("stream") : function() {};
var p, b = e("./internal/streams/BufferList"), g = e("./internal/streams/destroy");
d.inherits(v, o);
var m = [ "error", "close", "destroy", "pause", "resume" ];
function y(t, r) {
a = a || e("./_stream_duplex");
t = t || {};
var i = r instanceof a;
this.objectMode = !!t.objectMode;
i && (this.objectMode = this.objectMode || !!t.readableObjectMode);
var n = t.highWaterMark, s = t.readableHighWaterMark, f = this.objectMode ? 16 : 16384;
this.highWaterMark = n || 0 === n ? n : i && (s || 0 === s) ? s : f;
this.highWaterMark = Math.floor(this.highWaterMark);
this.buffer = new b();
this.length = 0;
this.pipes = null;
this.pipesCount = 0;
this.flowing = null;
this.ended = !1;
this.endEmitted = !1;
this.reading = !1;
this.sync = !0;
this.needReadable = !1;
this.emittedReadable = !1;
this.readableListening = !1;
this.resumeScheduled = !1;
this.destroyed = !1;
this.defaultEncoding = t.defaultEncoding || "utf8";
this.awaitDrain = 0;
this.readingMore = !1;
this.decoder = null;
this.encoding = null;
if (t.encoding) {
p || (p = e("string_decoder/").StringDecoder);
this.decoder = new p(t.encoding);
this.encoding = t.encoding;
}
}
function v(t) {
a = a || e("./_stream_duplex");
if (!(this instanceof v)) return new v(t);
this._readableState = new y(t, this);
this.readable = !0;
if (t) {
"function" == typeof t.read && (this._read = t.read);
"function" == typeof t.destroy && (this._destroy = t.destroy);
}
o.call(this);
}
Object.defineProperty(v.prototype, "destroyed", {
get: function() {
return void 0 !== this._readableState && this._readableState.destroyed;
},
set: function(e) {
this._readableState && (this._readableState.destroyed = e);
}
});
v.prototype.destroy = g.destroy;
v.prototype._undestroy = g.undestroy;
v.prototype._destroy = function(e, t) {
this.push(null);
t(e);
};
v.prototype.push = function(e, t) {
var r, i = this._readableState;
if (i.objectMode) r = !0; else if ("string" == typeof e) {
if ((t = t || i.defaultEncoding) !== i.encoding) {
e = c.from(e, t);
t = "";
}
r = !0;
}
return _(this, e, t, !1, r);
};
v.prototype.unshift = function(e) {
return _(this, e, null, !0, !1);
};
function _(e, t, r, i, n) {
var a = e._readableState;
if (null === t) {
a.reading = !1;
(function(e, t) {
if (t.ended) return;
if (t.decoder) {
var r = t.decoder.end();
if (r && r.length) {
t.buffer.push(r);
t.length += t.objectMode ? 1 : r.length;
}
}
t.ended = !0;
M(e);
})(e, a);
} else {
var s;
n || (s = function(e, t) {
var r;
(function(e) {
return c.isBuffer(e) || e instanceof h;
})(t) || "string" == typeof t || void 0 === t || e.objectMode || (r = new TypeError("Invalid non-string/buffer chunk"));
return r;
}(a, t));
if (s) e.emit("error", s); else if (a.objectMode || t && t.length > 0) {
"string" == typeof t || a.objectMode || Object.getPrototypeOf(t) === c.prototype || (t = function(e) {
return c.from(e);
}(t));
if (i) a.endEmitted ? e.emit("error", new Error("stream.unshift() after end event")) : w(e, a, t, !0); else if (a.ended) e.emit("error", new Error("stream.push() after EOF")); else {
a.reading = !1;
if (a.decoder && !r) {
t = a.decoder.write(t);
a.objectMode || 0 !== t.length ? w(e, a, t, !1) : A(e, a);
} else w(e, a, t, !1);
}
} else i || (a.reading = !1);
}
return function(e) {
return !e.ended && (e.needReadable || e.length < e.highWaterMark || 0 === e.length);
}(a);
}
function w(e, t, r, i) {
if (t.flowing && 0 === t.length && !t.sync) {
e.emit("data", r);
e.read(0);
} else {
t.length += t.objectMode ? 1 : r.length;
i ? t.buffer.unshift(r) : t.buffer.push(r);
t.needReadable && M(e);
}
A(e, t);
}
v.prototype.isPaused = function() {
return !1 === this._readableState.flowing;
};
v.prototype.setEncoding = function(t) {
p || (p = e("string_decoder/").StringDecoder);
this._readableState.decoder = new p(t);
this._readableState.encoding = t;
return this;
};
var S = 8388608;
function E(e, t) {
if (e <= 0 || 0 === t.length && t.ended) return 0;
if (t.objectMode) return 1;
if (e != e) return t.flowing && t.length ? t.buffer.head.data.length : t.length;
e > t.highWaterMark && (t.highWaterMark = function(e) {
if (e >= S) e = S; else {
e--;
e |= e >>> 1;
e |= e >>> 2;
e |= e >>> 4;
e |= e >>> 8;
e |= e >>> 16;
e++;
}
return e;
}(e));
if (e <= t.length) return e;
if (!t.ended) {
t.needReadable = !0;
return 0;
}
return t.length;
}
v.prototype.read = function(e) {
l("read", e);
e = parseInt(e, 10);
var t = this._readableState, r = e;
0 !== e && (t.emittedReadable = !1);
if (0 === e && t.needReadable && (t.length >= t.highWaterMark || t.ended)) {
l("read: emitReadable", t.length, t.ended);
0 === t.length && t.ended ? j(this) : M(this);
return null;
}
if (0 === (e = E(e, t)) && t.ended) {
0 === t.length && j(this);
return null;
}
var i, n = t.needReadable;
l("need readable", n);
(0 === t.length || t.length - e < t.highWaterMark) && l("length less than watermark", n = !0);
if (t.ended || t.reading) l("reading or ended", n = !1); else if (n) {
l("do read");
t.reading = !0;
t.sync = !0;
0 === t.length && (t.needReadable = !0);
this._read(t.highWaterMark);
t.sync = !1;
t.reading || (e = E(r, t));
}
if (null === (i = e > 0 ? C(e, t) : null)) {
t.needReadable = !0;
e = 0;
} else t.length -= e;
if (0 === t.length) {
t.ended || (t.needReadable = !0);
r !== e && t.ended && j(this);
}
null !== i && this.emit("data", i);
return i;
};
function M(e) {
var t = e._readableState;
t.needReadable = !1;
if (!t.emittedReadable) {
l("emitReadable", t.flowing);
t.emittedReadable = !0;
t.sync ? n.nextTick(k, e) : k(e);
}
}
function k(e) {
l("emit readable");
e.emit("readable");
B(e);
}
function A(e, t) {
if (!t.readingMore) {
t.readingMore = !0;
n.nextTick(x, e, t);
}
}
function x(e, t) {
for (var r = t.length; !t.reading && !t.flowing && !t.ended && t.length < t.highWaterMark; ) {
l("maybeReadMore read 0");
e.read(0);
if (r === t.length) break;
r = t.length;
}
t.readingMore = !1;
}
v.prototype._read = function(e) {
this.emit("error", new Error("_read() is not implemented"));
};
v.prototype.pipe = function(e, t) {
var i = this, a = this._readableState;
switch (a.pipesCount) {
case 0:
a.pipes = e;
break;

case 1:
a.pipes = [ a.pipes, e ];
break;

default:
a.pipes.push(e);
}
a.pipesCount += 1;
l("pipe count=%d opts=%j", a.pipesCount, t);
var o = (!t || !1 !== t.end) && e !== r.stdout && e !== r.stderr ? h : v;
a.endEmitted ? n.nextTick(o) : i.once("end", o);
e.on("unpipe", c);
function c(t, r) {
l("onunpipe");
if (t === i && r && !1 === r.hasUnpiped) {
r.hasUnpiped = !0;
(function() {
l("cleanup");
e.removeListener("close", m);
e.removeListener("finish", y);
e.removeListener("drain", d);
e.removeListener("error", g);
e.removeListener("unpipe", c);
i.removeListener("end", h);
i.removeListener("end", v);
i.removeListener("data", b);
u = !0;
!a.awaitDrain || e._writableState && !e._writableState.needDrain || d();
})();
}
}
function h() {
l("onend");
e.end();
}
var d = function(e) {
return function() {
var t = e._readableState;
l("pipeOnDrain", t.awaitDrain);
t.awaitDrain && t.awaitDrain--;
if (0 === t.awaitDrain && f(e, "data")) {
t.flowing = !0;
B(e);
}
};
}(i);
e.on("drain", d);
var u = !1;
var p = !1;
i.on("data", b);
function b(t) {
l("ondata");
p = !1;
if (!1 === e.write(t) && !p) {
if ((1 === a.pipesCount && a.pipes === e || a.pipesCount > 1 && -1 !== T(a.pipes, e)) && !u) {
l("false write response, pause", i._readableState.awaitDrain);
i._readableState.awaitDrain++;
p = !0;
}
i.pause();
}
}
function g(t) {
l("onerror", t);
v();
e.removeListener("error", g);
0 === f(e, "error") && e.emit("error", t);
}
(function(e, t, r) {
if ("function" == typeof e.prependListener) return e.prependListener(t, r);
e._events && e._events[t] ? s(e._events[t]) ? e._events[t].unshift(r) : e._events[t] = [ r, e._events[t] ] : e.on(t, r);
})(e, "error", g);
function m() {
e.removeListener("finish", y);
v();
}
e.once("close", m);
function y() {
l("onfinish");
e.removeListener("close", m);
v();
}
e.once("finish", y);
function v() {
l("unpipe");
i.unpipe(e);
}
e.emit("pipe", i);
if (!a.flowing) {
l("pipe resume");
i.resume();
}
return e;
};
v.prototype.unpipe = function(e) {
var t = this._readableState, r = {
hasUnpiped: !1
};
if (0 === t.pipesCount) return this;
if (1 === t.pipesCount) {
if (e && e !== t.pipes) return this;
e || (e = t.pipes);
t.pipes = null;
t.pipesCount = 0;
t.flowing = !1;
e && e.emit("unpipe", this, r);
return this;
}
if (!e) {
var i = t.pipes, n = t.pipesCount;
t.pipes = null;
t.pipesCount = 0;
t.flowing = !1;
for (var a = 0; a < n; a++) i[a].emit("unpipe", this, r);
return this;
}
var s = T(t.pipes, e);
if (-1 === s) return this;
t.pipes.splice(s, 1);
t.pipesCount -= 1;
1 === t.pipesCount && (t.pipes = t.pipes[0]);
e.emit("unpipe", this, r);
return this;
};
v.prototype.on = function(e, t) {
var r = o.prototype.on.call(this, e, t);
if ("data" === e) !1 !== this._readableState.flowing && this.resume(); else if ("readable" === e) {
var i = this._readableState;
if (!i.endEmitted && !i.readableListening) {
i.readableListening = i.needReadable = !0;
i.emittedReadable = !1;
i.reading ? i.length && M(this) : n.nextTick(I, this);
}
}
return r;
};
v.prototype.addListener = v.prototype.on;
function I(e) {
l("readable nexttick read 0");
e.read(0);
}
v.prototype.resume = function() {
var e = this._readableState;
if (!e.flowing) {
l("resume");
e.flowing = !0;
(function(e, t) {
if (!t.resumeScheduled) {
t.resumeScheduled = !0;
n.nextTick(R, e, t);
}
})(this, e);
}
return this;
};
function R(e, t) {
if (!t.reading) {
l("resume read 0");
e.read(0);
}
t.resumeScheduled = !1;
t.awaitDrain = 0;
e.emit("resume");
B(e);
t.flowing && !t.reading && e.read(0);
}
v.prototype.pause = function() {
l("call pause flowing=%j", this._readableState.flowing);
if (!1 !== this._readableState.flowing) {
l("pause");
this._readableState.flowing = !1;
this.emit("pause");
}
return this;
};
function B(e) {
var t = e._readableState;
l("flow", t.flowing);
for (;t.flowing && null !== e.read(); ) ;
}
v.prototype.wrap = function(e) {
var t = this, r = this._readableState, i = !1;
e.on("end", function() {
l("wrapped end");
if (r.decoder && !r.ended) {
var e = r.decoder.end();
e && e.length && t.push(e);
}
t.push(null);
});
e.on("data", function(n) {
l("wrapped data");
r.decoder && (n = r.decoder.write(n));
if ((!r.objectMode || null !== n && void 0 !== n) && (r.objectMode || n && n.length)) {
if (!t.push(n)) {
i = !0;
e.pause();
}
}
});
for (var n in e) void 0 === this[n] && "function" == typeof e[n] && (this[n] = function(t) {
return function() {
return e[t].apply(e, arguments);
};
}(n));
for (var a = 0; a < m.length; a++) e.on(m[a], this.emit.bind(this, m[a]));
this._read = function(t) {
l("wrapped _read", t);
if (i) {
i = !1;
e.resume();
}
};
return this;
};
Object.defineProperty(v.prototype, "readableHighWaterMark", {
enumerable: !1,
get: function() {
return this._readableState.highWaterMark;
}
});
v._fromList = C;
function C(e, t) {
if (0 === t.length) return null;
var r;
if (t.objectMode) r = t.buffer.shift(); else if (!e || e >= t.length) {
r = t.decoder ? t.buffer.join("") : 1 === t.buffer.length ? t.buffer.head.data : t.buffer.concat(t.length);
t.buffer.clear();
} else r = function(e, t, r) {
var i;
if (e < t.head.data.length) {
i = t.head.data.slice(0, e);
t.head.data = t.head.data.slice(e);
} else i = e === t.head.data.length ? t.shift() : r ? function(e, t) {
var r = t.head, i = 1, n = r.data;
e -= n.length;
for (;r = r.next; ) {
var a = r.data, s = e > a.length ? a.length : e;
s === a.length ? n += a : n += a.slice(0, e);
if (0 === (e -= s)) {
if (s === a.length) {
++i;
r.next ? t.head = r.next : t.head = t.tail = null;
} else {
t.head = r;
r.data = a.slice(s);
}
break;
}
++i;
}
t.length -= i;
return n;
}(e, t) : function(e, t) {
var r = c.allocUnsafe(e), i = t.head, n = 1;
i.data.copy(r);
e -= i.data.length;
for (;i = i.next; ) {
var a = i.data, s = e > a.length ? a.length : e;
a.copy(r, r.length - e, 0, s);
if (0 === (e -= s)) {
if (s === a.length) {
++n;
i.next ? t.head = i.next : t.head = t.tail = null;
} else {
t.head = i;
i.data = a.slice(s);
}
break;
}
++n;
}
t.length -= n;
return r;
}(e, t);
return i;
}(e, t.buffer, t.decoder);
return r;
}
function j(e) {
var t = e._readableState;
if (t.length > 0) throw new Error('"endReadable()" called on non-empty stream');
if (!t.endEmitted) {
t.ended = !0;
n.nextTick(P, t, e);
}
}
function P(e, t) {
if (!e.endEmitted && 0 === e.length) {
e.endEmitted = !0;
t.readable = !1;
t.emit("end");
}
}
function T(e, t) {
for (var r = 0, i = e.length; r < i; r++) if (e[r] === t) return r;
return -1;
}
}).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
}, {
"./_stream_duplex": 128,
"./internal/streams/BufferList": 133,
"./internal/streams/destroy": 134,
"./internal/streams/stream": 135,
_process: 118,
"core-util-is": 50,
events: 83,
inherits: 101,
isarray: 136,
"process-nextick-args": 117,
"safe-buffer": 143,
"string_decoder/": 137,
util: 18
} ],
131: [ function(e, t, r) {
"use strict";
t.exports = a;
var i = e("./_stream_duplex"), n = e("core-util-is");
n.inherits = e("inherits");
n.inherits(a, i);
function a(e) {
if (!(this instanceof a)) return new a(e);
i.call(this, e);
this._transformState = {
afterTransform: function(e, t) {
var r = this._transformState;
r.transforming = !1;
var i = r.writecb;
if (!i) return this.emit("error", new Error("write callback called multiple times"));
r.writechunk = null;
r.writecb = null;
null != t && this.push(t);
i(e);
var n = this._readableState;
n.reading = !1;
(n.needReadable || n.length < n.highWaterMark) && this._read(n.highWaterMark);
}.bind(this),
needTransform: !1,
transforming: !1,
writecb: null,
writechunk: null,
writeencoding: null
};
this._readableState.needReadable = !0;
this._readableState.sync = !1;
if (e) {
"function" == typeof e.transform && (this._transform = e.transform);
"function" == typeof e.flush && (this._flush = e.flush);
}
this.on("prefinish", s);
}
function s() {
var e = this;
"function" == typeof this._flush ? this._flush(function(t, r) {
f(e, t, r);
}) : f(this, null, null);
}
a.prototype.push = function(e, t) {
this._transformState.needTransform = !1;
return i.prototype.push.call(this, e, t);
};
a.prototype._transform = function(e, t, r) {
throw new Error("_transform() is not implemented");
};
a.prototype._write = function(e, t, r) {
var i = this._transformState;
i.writecb = r;
i.writechunk = e;
i.writeencoding = t;
if (!i.transforming) {
var n = this._readableState;
(i.needTransform || n.needReadable || n.length < n.highWaterMark) && this._read(n.highWaterMark);
}
};
a.prototype._read = function(e) {
var t = this._transformState;
if (null !== t.writechunk && t.writecb && !t.transforming) {
t.transforming = !0;
this._transform(t.writechunk, t.writeencoding, t.afterTransform);
} else t.needTransform = !0;
};
a.prototype._destroy = function(e, t) {
var r = this;
i.prototype._destroy.call(this, e, function(e) {
t(e);
r.emit("close");
});
};
function f(e, t, r) {
if (t) return e.emit("error", t);
null != r && e.push(r);
if (e._writableState.length) throw new Error("Calling transform done when ws.length != 0");
if (e._transformState.transforming) throw new Error("Calling transform done when still transforming");
return e.push(null);
}
}, {
"./_stream_duplex": 128,
"core-util-is": 50,
inherits: 101
} ],
132: [ function(e, t, r) {
(function(r, i) {
"use strict";
var n = e("process-nextick-args");
t.exports = m;
function a(e) {
var t = this;
this.next = null;
this.entry = null;
this.finish = function() {
(function(e, t, r) {
var i = e.entry;
e.entry = null;
for (;i; ) {
var n = i.callback;
t.pendingcb--;
n(r);
i = i.next;
}
t.corkedRequestsFree ? t.corkedRequestsFree.next = e : t.corkedRequestsFree = e;
})(t, e);
};
}
var s, f = !r.browser && [ "v0.10", "v0.9." ].indexOf(r.version.slice(0, 5)) > -1 ? setImmediate : n.nextTick;
m.WritableState = g;
var o = e("core-util-is");
o.inherits = e("inherits");
var c = {
deprecate: e("util-deprecate")
}, h = e("./internal/streams/stream"), d = e("safe-buffer").Buffer, u = i.Uint8Array || function() {};
var l, p = e("./internal/streams/destroy");
o.inherits(m, h);
function b() {}
function g(t, r) {
s = s || e("./_stream_duplex");
t = t || {};
var i = r instanceof s;
this.objectMode = !!t.objectMode;
i && (this.objectMode = this.objectMode || !!t.writableObjectMode);
var o = t.highWaterMark, c = t.writableHighWaterMark, h = this.objectMode ? 16 : 16384;
this.highWaterMark = o || 0 === o ? o : i && (c || 0 === c) ? c : h;
this.highWaterMark = Math.floor(this.highWaterMark);
this.finalCalled = !1;
this.needDrain = !1;
this.ending = !1;
this.ended = !1;
this.finished = !1;
this.destroyed = !1;
var d = !1 === t.decodeStrings;
this.decodeStrings = !d;
this.defaultEncoding = t.defaultEncoding || "utf8";
this.length = 0;
this.writing = !1;
this.corked = 0;
this.sync = !0;
this.bufferProcessing = !1;
this.onwrite = function(e) {
(function(e, t) {
var r = e._writableState, i = r.sync, a = r.writecb;
(function(e) {
e.writing = !1;
e.writecb = null;
e.length -= e.writelen;
e.writelen = 0;
})(r);
if (t) (function(e, t, r, i, a) {
--t.pendingcb;
if (r) {
n.nextTick(a, i);
n.nextTick(E, e, t);
e._writableState.errorEmitted = !0;
e.emit("error", i);
} else {
a(i);
e._writableState.errorEmitted = !0;
e.emit("error", i);
E(e, t);
}
})(e, r, i, t, a); else {
var s = w(r);
s || r.corked || r.bufferProcessing || !r.bufferedRequest || _(e, r);
i ? f(v, e, r, s, a) : v(e, r, s, a);
}
})(r, e);
};
this.writecb = null;
this.writelen = 0;
this.bufferedRequest = null;
this.lastBufferedRequest = null;
this.pendingcb = 0;
this.prefinished = !1;
this.errorEmitted = !1;
this.bufferedRequestCount = 0;
this.corkedRequestsFree = new a(this);
}
g.prototype.getBuffer = function() {
for (var e = this.bufferedRequest, t = []; e; ) {
t.push(e);
e = e.next;
}
return t;
};
(function() {
try {
Object.defineProperty(g.prototype, "buffer", {
get: c.deprecate(function() {
return this.getBuffer();
}, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
});
} catch (e) {}
})();
if ("function" == typeof Symbol && Symbol.hasInstance && "function" == typeof Function.prototype[Symbol.hasInstance]) {
l = Function.prototype[Symbol.hasInstance];
Object.defineProperty(m, Symbol.hasInstance, {
value: function(e) {
return !!l.call(this, e) || this === m && (e && e._writableState instanceof g);
}
});
} else l = function(e) {
return e instanceof this;
};
function m(t) {
s = s || e("./_stream_duplex");
if (!(l.call(m, this) || this instanceof s)) return new m(t);
this._writableState = new g(t, this);
this.writable = !0;
if (t) {
"function" == typeof t.write && (this._write = t.write);
"function" == typeof t.writev && (this._writev = t.writev);
"function" == typeof t.destroy && (this._destroy = t.destroy);
"function" == typeof t.final && (this._final = t.final);
}
h.call(this);
}
m.prototype.pipe = function() {
this.emit("error", new Error("Cannot pipe, not readable"));
};
m.prototype.write = function(e, t, r) {
var i = this._writableState, a = !1, s = !i.objectMode && function(e) {
return d.isBuffer(e) || e instanceof u;
}(e);
s && !d.isBuffer(e) && (e = function(e) {
return d.from(e);
}(e));
if ("function" == typeof t) {
r = t;
t = null;
}
s ? t = "buffer" : t || (t = i.defaultEncoding);
"function" != typeof r && (r = b);
if (i.ended) (function(e, t) {
var r = new Error("write after end");
e.emit("error", r);
n.nextTick(t, r);
})(this, r); else if (s || function(e, t, r, i) {
var a = !0, s = !1;
null === r ? s = new TypeError("May not write null values to stream") : "string" == typeof r || void 0 === r || t.objectMode || (s = new TypeError("Invalid non-string/buffer chunk"));
if (s) {
e.emit("error", s);
n.nextTick(i, s);
a = !1;
}
return a;
}(this, i, e, r)) {
i.pendingcb++;
a = function(e, t, r, i, n, a) {
if (!r) {
var s = function(e, t, r) {
e.objectMode || !1 === e.decodeStrings || "string" != typeof t || (t = d.from(t, r));
return t;
}(t, i, n);
if (i !== s) {
r = !0;
n = "buffer";
i = s;
}
}
var f = t.objectMode ? 1 : i.length;
t.length += f;
var o = t.length < t.highWaterMark;
o || (t.needDrain = !0);
if (t.writing || t.corked) {
var c = t.lastBufferedRequest;
t.lastBufferedRequest = {
chunk: i,
encoding: n,
isBuf: r,
callback: a,
next: null
};
c ? c.next = t.lastBufferedRequest : t.bufferedRequest = t.lastBufferedRequest;
t.bufferedRequestCount += 1;
} else y(e, t, !1, f, i, n, a);
return o;
}(this, i, s, e, t, r);
}
return a;
};
m.prototype.cork = function() {
this._writableState.corked++;
};
m.prototype.uncork = function() {
var e = this._writableState;
if (e.corked) {
e.corked--;
e.writing || e.corked || e.finished || e.bufferProcessing || !e.bufferedRequest || _(this, e);
}
};
m.prototype.setDefaultEncoding = function(e) {
"string" == typeof e && (e = e.toLowerCase());
if (!([ "hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw" ].indexOf((e + "").toLowerCase()) > -1)) throw new TypeError("Unknown encoding: " + e);
this._writableState.defaultEncoding = e;
return this;
};
Object.defineProperty(m.prototype, "writableHighWaterMark", {
enumerable: !1,
get: function() {
return this._writableState.highWaterMark;
}
});
function y(e, t, r, i, n, a, s) {
t.writelen = i;
t.writecb = s;
t.writing = !0;
t.sync = !0;
r ? e._writev(n, t.onwrite) : e._write(n, a, t.onwrite);
t.sync = !1;
}
function v(e, t, r, i) {
r || function(e, t) {
if (0 === t.length && t.needDrain) {
t.needDrain = !1;
e.emit("drain");
}
}(e, t);
t.pendingcb--;
i();
E(e, t);
}
function _(e, t) {
t.bufferProcessing = !0;
var r = t.bufferedRequest;
if (e._writev && r && r.next) {
var i = t.bufferedRequestCount, n = new Array(i), s = t.corkedRequestsFree;
s.entry = r;
for (var f = 0, o = !0; r; ) {
n[f] = r;
r.isBuf || (o = !1);
r = r.next;
f += 1;
}
n.allBuffers = o;
y(e, t, !0, t.length, n, "", s.finish);
t.pendingcb++;
t.lastBufferedRequest = null;
if (s.next) {
t.corkedRequestsFree = s.next;
s.next = null;
} else t.corkedRequestsFree = new a(t);
t.bufferedRequestCount = 0;
} else {
for (;r; ) {
var c = r.chunk, h = r.encoding, d = r.callback;
y(e, t, !1, t.objectMode ? 1 : c.length, c, h, d);
r = r.next;
t.bufferedRequestCount--;
if (t.writing) break;
}
null === r && (t.lastBufferedRequest = null);
}
t.bufferedRequest = r;
t.bufferProcessing = !1;
}
m.prototype._write = function(e, t, r) {
r(new Error("_write() is not implemented"));
};
m.prototype._writev = null;
m.prototype.end = function(e, t, r) {
var i = this._writableState;
if ("function" == typeof e) {
r = e;
e = null;
t = null;
} else if ("function" == typeof t) {
r = t;
t = null;
}
null !== e && void 0 !== e && this.write(e, t);
if (i.corked) {
i.corked = 1;
this.uncork();
}
i.ending || i.finished || function(e, t, r) {
t.ending = !0;
E(e, t);
r && (t.finished ? n.nextTick(r) : e.once("finish", r));
t.ended = !0;
e.writable = !1;
}(this, i, r);
};
function w(e) {
return e.ending && 0 === e.length && null === e.bufferedRequest && !e.finished && !e.writing;
}
function S(e, t) {
e._final(function(r) {
t.pendingcb--;
r && e.emit("error", r);
t.prefinished = !0;
e.emit("prefinish");
E(e, t);
});
}
function E(e, t) {
var r = w(t);
if (r) {
(function(e, t) {
if (!t.prefinished && !t.finalCalled) if ("function" == typeof e._final) {
t.pendingcb++;
t.finalCalled = !0;
n.nextTick(S, e, t);
} else {
t.prefinished = !0;
e.emit("prefinish");
}
})(e, t);
if (0 === t.pendingcb) {
t.finished = !0;
e.emit("finish");
}
}
return r;
}
Object.defineProperty(m.prototype, "destroyed", {
get: function() {
return void 0 !== this._writableState && this._writableState.destroyed;
},
set: function(e) {
this._writableState && (this._writableState.destroyed = e);
}
});
m.prototype.destroy = p.destroy;
m.prototype._undestroy = p.undestroy;
m.prototype._destroy = function(e, t) {
this.end();
t(e);
};
}).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
}, {
"./_stream_duplex": 128,
"./internal/streams/destroy": 134,
"./internal/streams/stream": 135,
_process: 118,
"core-util-is": 50,
inherits: 101,
"process-nextick-args": 117,
"safe-buffer": 143,
"util-deprecate": 154
} ],
133: [ function(e, t, r) {
"use strict";
var i = e("safe-buffer").Buffer, n = e("util");
function a(e, t, r) {
e.copy(t, r);
}
t.exports = function() {
function e() {
(function(e, t) {
if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
})(this, e);
this.head = null;
this.tail = null;
this.length = 0;
}
e.prototype.push = function(e) {
var t = {
data: e,
next: null
};
this.length > 0 ? this.tail.next = t : this.head = t;
this.tail = t;
++this.length;
};
e.prototype.unshift = function(e) {
var t = {
data: e,
next: this.head
};
0 === this.length && (this.tail = t);
this.head = t;
++this.length;
};
e.prototype.shift = function() {
if (0 !== this.length) {
var e = this.head.data;
1 === this.length ? this.head = this.tail = null : this.head = this.head.next;
--this.length;
return e;
}
};
e.prototype.clear = function() {
this.head = this.tail = null;
this.length = 0;
};
e.prototype.join = function(e) {
if (0 === this.length) return "";
for (var t = this.head, r = "" + t.data; t = t.next; ) r += e + t.data;
return r;
};
e.prototype.concat = function(e) {
if (0 === this.length) return i.alloc(0);
if (1 === this.length) return this.head.data;
for (var t = i.allocUnsafe(e >>> 0), r = this.head, n = 0; r; ) {
a(r.data, t, n);
n += r.data.length;
r = r.next;
}
return t;
};
return e;
}();
n && n.inspect && n.inspect.custom && (t.exports.prototype[n.inspect.custom] = function() {
var e = n.inspect({
length: this.length
});
return this.constructor.name + " " + e;
});
}, {
"safe-buffer": 143,
util: 18
} ],
134: [ function(e, t, r) {
"use strict";
var i = e("process-nextick-args");
function n(e, t) {
e.emit("error", t);
}
t.exports = {
destroy: function(e, t) {
var r = this, a = this._readableState && this._readableState.destroyed, s = this._writableState && this._writableState.destroyed;
if (a || s) {
t ? t(e) : !e || this._writableState && this._writableState.errorEmitted || i.nextTick(n, this, e);
return this;
}
this._readableState && (this._readableState.destroyed = !0);
this._writableState && (this._writableState.destroyed = !0);
this._destroy(e || null, function(e) {
if (!t && e) {
i.nextTick(n, r, e);
r._writableState && (r._writableState.errorEmitted = !0);
} else t && t(e);
});
return this;
},
undestroy: function() {
if (this._readableState) {
this._readableState.destroyed = !1;
this._readableState.reading = !1;
this._readableState.ended = !1;
this._readableState.endEmitted = !1;
}
if (this._writableState) {
this._writableState.destroyed = !1;
this._writableState.ended = !1;
this._writableState.ending = !1;
this._writableState.finished = !1;
this._writableState.errorEmitted = !1;
}
}
};
}, {
"process-nextick-args": 117
} ],
135: [ function(e, t, r) {
t.exports = e("events").EventEmitter;
}, {
events: 83
} ],
136: [ function(e, t, r) {
arguments[4][48][0].apply(r, arguments);
}, {
dup: 48
} ],
137: [ function(e, t, r) {
"use strict";
var i = e("safe-buffer").Buffer, n = i.isEncoding || function(e) {
switch ((e = "" + e) && e.toLowerCase()) {
case "hex":
case "utf8":
case "utf-8":
case "ascii":
case "binary":
case "base64":
case "ucs2":
case "ucs-2":
case "utf16le":
case "utf-16le":
case "raw":
return !0;

default:
return !1;
}
};
r.StringDecoder = a;
function a(e) {
this.encoding = function(e) {
var t = function(e) {
if (!e) return "utf8";
for (var t; ;) switch (e) {
case "utf8":
case "utf-8":
return "utf8";

case "ucs2":
case "ucs-2":
case "utf16le":
case "utf-16le":
return "utf16le";

case "latin1":
case "binary":
return "latin1";

case "base64":
case "ascii":
case "hex":
return e;

default:
if (t) return;
e = ("" + e).toLowerCase();
t = !0;
}
}(e);
if ("string" != typeof t && (i.isEncoding === n || !n(e))) throw new Error("Unknown encoding: " + e);
return t || e;
}(e);
var t;
switch (this.encoding) {
case "utf16le":
this.text = o;
this.end = c;
t = 4;
break;

case "utf8":
this.fillLast = f;
t = 4;
break;

case "base64":
this.text = h;
this.end = d;
t = 3;
break;

default:
this.write = u;
this.end = l;
return;
}
this.lastNeed = 0;
this.lastTotal = 0;
this.lastChar = i.allocUnsafe(t);
}
a.prototype.write = function(e) {
if (0 === e.length) return "";
var t, r;
if (this.lastNeed) {
if (void 0 === (t = this.fillLast(e))) return "";
r = this.lastNeed;
this.lastNeed = 0;
} else r = 0;
return r < e.length ? t ? t + this.text(e, r) : this.text(e, r) : t || "";
};
a.prototype.end = function(e) {
var t = e && e.length ? this.write(e) : "";
return this.lastNeed ? t + "�" : t;
};
a.prototype.text = function(e, t) {
var r = function(e, t, r) {
var i = t.length - 1;
if (i < r) return 0;
var n = s(t[i]);
if (n >= 0) {
n > 0 && (e.lastNeed = n - 1);
return n;
}
if (--i < r || -2 === n) return 0;
if ((n = s(t[i])) >= 0) {
n > 0 && (e.lastNeed = n - 2);
return n;
}
if (--i < r || -2 === n) return 0;
if ((n = s(t[i])) >= 0) {
n > 0 && (2 === n ? n = 0 : e.lastNeed = n - 3);
return n;
}
return 0;
}(this, e, t);
if (!this.lastNeed) return e.toString("utf8", t);
this.lastTotal = r;
var i = e.length - (r - this.lastNeed);
e.copy(this.lastChar, 0, i);
return e.toString("utf8", t, i);
};
a.prototype.fillLast = function(e) {
if (this.lastNeed <= e.length) {
e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
return this.lastChar.toString(this.encoding, 0, this.lastTotal);
}
e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, e.length);
this.lastNeed -= e.length;
};
function s(e) {
return e <= 127 ? 0 : e >> 5 == 6 ? 2 : e >> 4 == 14 ? 3 : e >> 3 == 30 ? 4 : e >> 6 == 2 ? -1 : -2;
}
function f(e) {
var t = this.lastTotal - this.lastNeed, r = function(e, t, r) {
if (128 != (192 & t[0])) {
e.lastNeed = 0;
return "�";
}
if (e.lastNeed > 1 && t.length > 1) {
if (128 != (192 & t[1])) {
e.lastNeed = 1;
return "�";
}
if (e.lastNeed > 2 && t.length > 2 && 128 != (192 & t[2])) {
e.lastNeed = 2;
return "�";
}
}
}(this, e);
if (void 0 !== r) return r;
if (this.lastNeed <= e.length) {
e.copy(this.lastChar, t, 0, this.lastNeed);
return this.lastChar.toString(this.encoding, 0, this.lastTotal);
}
e.copy(this.lastChar, t, 0, e.length);
this.lastNeed -= e.length;
}
function o(e, t) {
if ((e.length - t) % 2 == 0) {
var r = e.toString("utf16le", t);
if (r) {
var i = r.charCodeAt(r.length - 1);
if (i >= 55296 && i <= 56319) {
this.lastNeed = 2;
this.lastTotal = 4;
this.lastChar[0] = e[e.length - 2];
this.lastChar[1] = e[e.length - 1];
return r.slice(0, -1);
}
}
return r;
}
this.lastNeed = 1;
this.lastTotal = 2;
this.lastChar[0] = e[e.length - 1];
return e.toString("utf16le", t, e.length - 1);
}
function c(e) {
var t = e && e.length ? this.write(e) : "";
if (this.lastNeed) {
var r = this.lastTotal - this.lastNeed;
return t + this.lastChar.toString("utf16le", 0, r);
}
return t;
}
function h(e, t) {
var r = (e.length - t) % 3;
if (0 === r) return e.toString("base64", t);
this.lastNeed = 3 - r;
this.lastTotal = 3;
if (1 === r) this.lastChar[0] = e[e.length - 1]; else {
this.lastChar[0] = e[e.length - 2];
this.lastChar[1] = e[e.length - 1];
}
return e.toString("base64", t, e.length - r);
}
function d(e) {
var t = e && e.length ? this.write(e) : "";
return this.lastNeed ? t + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : t;
}
function u(e) {
return e.toString(this.encoding);
}
function l(e) {
return e && e.length ? this.write(e) : "";
}
}, {
"safe-buffer": 143
} ],
138: [ function(e, t, r) {
t.exports = e("./readable").PassThrough;
}, {
"./readable": 139
} ],
139: [ function(e, t, r) {
(r = t.exports = e("./lib/_stream_readable.js")).Stream = r;
r.Readable = r;
r.Writable = e("./lib/_stream_writable.js");
r.Duplex = e("./lib/_stream_duplex.js");
r.Transform = e("./lib/_stream_transform.js");
r.PassThrough = e("./lib/_stream_passthrough.js");
}, {
"./lib/_stream_duplex.js": 128,
"./lib/_stream_passthrough.js": 129,
"./lib/_stream_readable.js": 130,
"./lib/_stream_transform.js": 131,
"./lib/_stream_writable.js": 132
} ],
140: [ function(e, t, r) {
t.exports = e("./readable").Transform;
}, {
"./readable": 139
} ],
141: [ function(e, t, r) {
t.exports = e("./lib/_stream_writable.js");
}, {
"./lib/_stream_writable.js": 132
} ],
142: [ function(e, t, r) {
"use strict";
var i = e("buffer").Buffer, n = e("inherits"), a = e("hash-base"), s = new Array(16), f = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13 ], o = [ 5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11 ], c = [ 11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6 ], h = [ 8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11 ], d = [ 0, 1518500249, 1859775393, 2400959708, 2840853838 ], u = [ 1352829926, 1548603684, 1836072691, 2053994217, 0 ];
function l() {
a.call(this, 64);
this._a = 1732584193;
this._b = 4023233417;
this._c = 2562383102;
this._d = 271733878;
this._e = 3285377520;
}
n(l, a);
l.prototype._update = function() {
for (var e = s, t = 0; t < 16; ++t) e[t] = this._block.readInt32LE(4 * t);
for (var r = 0 | this._a, i = 0 | this._b, n = 0 | this._c, a = 0 | this._d, l = 0 | this._e, _ = 0 | this._a, w = 0 | this._b, S = 0 | this._c, E = 0 | this._d, M = 0 | this._e, k = 0; k < 80; k += 1) {
var A, x;
if (k < 16) {
A = b(r, i, n, a, l, e[f[k]], d[0], c[k]);
x = v(_, w, S, E, M, e[o[k]], u[0], h[k]);
} else if (k < 32) {
A = g(r, i, n, a, l, e[f[k]], d[1], c[k]);
x = y(_, w, S, E, M, e[o[k]], u[1], h[k]);
} else if (k < 48) {
A = m(r, i, n, a, l, e[f[k]], d[2], c[k]);
x = m(_, w, S, E, M, e[o[k]], u[2], h[k]);
} else if (k < 64) {
A = y(r, i, n, a, l, e[f[k]], d[3], c[k]);
x = g(_, w, S, E, M, e[o[k]], u[3], h[k]);
} else {
A = v(r, i, n, a, l, e[f[k]], d[4], c[k]);
x = b(_, w, S, E, M, e[o[k]], u[4], h[k]);
}
r = l;
l = a;
a = p(n, 10);
n = i;
i = A;
_ = M;
M = E;
E = p(S, 10);
S = w;
w = x;
}
var I = this._b + n + E | 0;
this._b = this._c + a + M | 0;
this._c = this._d + l + _ | 0;
this._d = this._e + r + w | 0;
this._e = this._a + i + S | 0;
this._a = I;
};
l.prototype._digest = function() {
this._block[this._blockOffset++] = 128;
if (this._blockOffset > 56) {
this._block.fill(0, this._blockOffset, 64);
this._update();
this._blockOffset = 0;
}
this._block.fill(0, this._blockOffset, 56);
this._block.writeUInt32LE(this._length[0], 56);
this._block.writeUInt32LE(this._length[1], 60);
this._update();
var e = i.alloc ? i.alloc(20) : new i(20);
e.writeInt32LE(this._a, 0);
e.writeInt32LE(this._b, 4);
e.writeInt32LE(this._c, 8);
e.writeInt32LE(this._d, 12);
e.writeInt32LE(this._e, 16);
return e;
};
function p(e, t) {
return e << t | e >>> 32 - t;
}
function b(e, t, r, i, n, a, s, f) {
return p(e + (t ^ r ^ i) + a + s | 0, f) + n | 0;
}
function g(e, t, r, i, n, a, s, f) {
return p(e + (t & r | ~t & i) + a + s | 0, f) + n | 0;
}
function m(e, t, r, i, n, a, s, f) {
return p(e + ((t | ~r) ^ i) + a + s | 0, f) + n | 0;
}
function y(e, t, r, i, n, a, s, f) {
return p(e + (t & i | r & ~i) + a + s | 0, f) + n | 0;
}
function v(e, t, r, i, n, a, s, f) {
return p(e + (t ^ (r | ~i)) + a + s | 0, f) + n | 0;
}
t.exports = l;
}, {
buffer: 47,
"hash-base": 85,
inherits: 101
} ],
143: [ function(e, t, r) {
var i = e("buffer"), n = i.Buffer;
function a(e, t) {
for (var r in e) t[r] = e[r];
}
if (n.from && n.alloc && n.allocUnsafe && n.allocUnsafeSlow) t.exports = i; else {
a(i, r);
r.Buffer = s;
}
function s(e, t, r) {
return n(e, t, r);
}
a(n, s);
s.from = function(e, t, r) {
if ("number" == typeof e) throw new TypeError("Argument must not be a number");
return n(e, t, r);
};
s.alloc = function(e, t, r) {
if ("number" != typeof e) throw new TypeError("Argument must be a number");
var i = n(e);
void 0 !== t ? "string" == typeof r ? i.fill(t, r) : i.fill(t) : i.fill(0);
return i;
};
s.allocUnsafe = function(e) {
if ("number" != typeof e) throw new TypeError("Argument must be a number");
return n(e);
};
s.allocUnsafeSlow = function(e) {
if ("number" != typeof e) throw new TypeError("Argument must be a number");
return i.SlowBuffer(e);
};
}, {
buffer: 47
} ],
144: [ function(e, t, r) {
var i = e("safe-buffer").Buffer;
function n(e, t) {
this._block = i.alloc(e);
this._finalSize = t;
this._blockSize = e;
this._len = 0;
}
n.prototype.update = function(e, t) {
if ("string" == typeof e) {
t = t || "utf8";
e = i.from(e, t);
}
for (var r = this._block, n = this._blockSize, a = e.length, s = this._len, f = 0; f < a; ) {
for (var o = s % n, c = Math.min(a - f, n - o), h = 0; h < c; h++) r[o + h] = e[f + h];
f += c;
(s += c) % n == 0 && this._update(r);
}
this._len += a;
return this;
};
n.prototype.digest = function(e) {
var t = this._len % this._blockSize;
this._block[t] = 128;
this._block.fill(0, t + 1);
if (t >= this._finalSize) {
this._update(this._block);
this._block.fill(0);
}
var r = 8 * this._len;
if (r <= 4294967295) this._block.writeUInt32BE(r, this._blockSize - 4); else {
var i = (4294967295 & r) >>> 0, n = (r - i) / 4294967296;
this._block.writeUInt32BE(n, this._blockSize - 8);
this._block.writeUInt32BE(i, this._blockSize - 4);
}
this._update(this._block);
var a = this._hash();
return e ? a.toString(e) : a;
};
n.prototype._update = function() {
throw new Error("_update must be implemented by subclass");
};
t.exports = n;
}, {
"safe-buffer": 143
} ],
145: [ function(e, t, r) {
(r = t.exports = function(e) {
e = e.toLowerCase();
var t = r[e];
if (!t) throw new Error(e + " is not supported (we accept pull requests)");
return new t();
}).sha = e("./sha");
r.sha1 = e("./sha1");
r.sha224 = e("./sha224");
r.sha256 = e("./sha256");
r.sha384 = e("./sha384");
r.sha512 = e("./sha512");
}, {
"./sha": 146,
"./sha1": 147,
"./sha224": 148,
"./sha256": 149,
"./sha384": 150,
"./sha512": 151
} ],
146: [ function(e, t, r) {
var i = e("inherits"), n = e("./hash"), a = e("safe-buffer").Buffer, s = [ 1518500249, 1859775393, -1894007588, -899497514 ], f = new Array(80);
function o() {
this.init();
this._w = f;
n.call(this, 64, 56);
}
i(o, n);
o.prototype.init = function() {
this._a = 1732584193;
this._b = 4023233417;
this._c = 2562383102;
this._d = 271733878;
this._e = 3285377520;
return this;
};
function c(e) {
return e << 5 | e >>> 27;
}
function h(e) {
return e << 30 | e >>> 2;
}
function d(e, t, r, i) {
return 0 === e ? t & r | ~t & i : 2 === e ? t & r | t & i | r & i : t ^ r ^ i;
}
o.prototype._update = function(e) {
for (var t = this._w, r = 0 | this._a, i = 0 | this._b, n = 0 | this._c, a = 0 | this._d, f = 0 | this._e, o = 0; o < 16; ++o) t[o] = e.readInt32BE(4 * o);
for (;o < 80; ++o) t[o] = t[o - 3] ^ t[o - 8] ^ t[o - 14] ^ t[o - 16];
for (var u = 0; u < 80; ++u) {
var l = ~~(u / 20), p = c(r) + d(l, i, n, a) + f + t[u] + s[l] | 0;
f = a;
a = n;
n = h(i);
i = r;
r = p;
}
this._a = r + this._a | 0;
this._b = i + this._b | 0;
this._c = n + this._c | 0;
this._d = a + this._d | 0;
this._e = f + this._e | 0;
};
o.prototype._hash = function() {
var e = a.allocUnsafe(20);
e.writeInt32BE(0 | this._a, 0);
e.writeInt32BE(0 | this._b, 4);
e.writeInt32BE(0 | this._c, 8);
e.writeInt32BE(0 | this._d, 12);
e.writeInt32BE(0 | this._e, 16);
return e;
};
t.exports = o;
}, {
"./hash": 144,
inherits: 101,
"safe-buffer": 143
} ],
147: [ function(e, t, r) {
var i = e("inherits"), n = e("./hash"), a = e("safe-buffer").Buffer, s = [ 1518500249, 1859775393, -1894007588, -899497514 ], f = new Array(80);
function o() {
this.init();
this._w = f;
n.call(this, 64, 56);
}
i(o, n);
o.prototype.init = function() {
this._a = 1732584193;
this._b = 4023233417;
this._c = 2562383102;
this._d = 271733878;
this._e = 3285377520;
return this;
};
function c(e) {
return e << 1 | e >>> 31;
}
function h(e) {
return e << 5 | e >>> 27;
}
function d(e) {
return e << 30 | e >>> 2;
}
function u(e, t, r, i) {
return 0 === e ? t & r | ~t & i : 2 === e ? t & r | t & i | r & i : t ^ r ^ i;
}
o.prototype._update = function(e) {
for (var t = this._w, r = 0 | this._a, i = 0 | this._b, n = 0 | this._c, a = 0 | this._d, f = 0 | this._e, o = 0; o < 16; ++o) t[o] = e.readInt32BE(4 * o);
for (;o < 80; ++o) t[o] = c(t[o - 3] ^ t[o - 8] ^ t[o - 14] ^ t[o - 16]);
for (var l = 0; l < 80; ++l) {
var p = ~~(l / 20), b = h(r) + u(p, i, n, a) + f + t[l] + s[p] | 0;
f = a;
a = n;
n = d(i);
i = r;
r = b;
}
this._a = r + this._a | 0;
this._b = i + this._b | 0;
this._c = n + this._c | 0;
this._d = a + this._d | 0;
this._e = f + this._e | 0;
};
o.prototype._hash = function() {
var e = a.allocUnsafe(20);
e.writeInt32BE(0 | this._a, 0);
e.writeInt32BE(0 | this._b, 4);
e.writeInt32BE(0 | this._c, 8);
e.writeInt32BE(0 | this._d, 12);
e.writeInt32BE(0 | this._e, 16);
return e;
};
t.exports = o;
}, {
"./hash": 144,
inherits: 101,
"safe-buffer": 143
} ],
148: [ function(e, t, r) {
var i = e("inherits"), n = e("./sha256"), a = e("./hash"), s = e("safe-buffer").Buffer, f = new Array(64);
function o() {
this.init();
this._w = f;
a.call(this, 64, 56);
}
i(o, n);
o.prototype.init = function() {
this._a = 3238371032;
this._b = 914150663;
this._c = 812702999;
this._d = 4144912697;
this._e = 4290775857;
this._f = 1750603025;
this._g = 1694076839;
this._h = 3204075428;
return this;
};
o.prototype._hash = function() {
var e = s.allocUnsafe(28);
e.writeInt32BE(this._a, 0);
e.writeInt32BE(this._b, 4);
e.writeInt32BE(this._c, 8);
e.writeInt32BE(this._d, 12);
e.writeInt32BE(this._e, 16);
e.writeInt32BE(this._f, 20);
e.writeInt32BE(this._g, 24);
return e;
};
t.exports = o;
}, {
"./hash": 144,
"./sha256": 149,
inherits: 101,
"safe-buffer": 143
} ],
149: [ function(e, t, r) {
var i = e("inherits"), n = e("./hash"), a = e("safe-buffer").Buffer, s = [ 1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298 ], f = new Array(64);
function o() {
this.init();
this._w = f;
n.call(this, 64, 56);
}
i(o, n);
o.prototype.init = function() {
this._a = 1779033703;
this._b = 3144134277;
this._c = 1013904242;
this._d = 2773480762;
this._e = 1359893119;
this._f = 2600822924;
this._g = 528734635;
this._h = 1541459225;
return this;
};
function c(e, t, r) {
return r ^ e & (t ^ r);
}
function h(e, t, r) {
return e & t | r & (e | t);
}
function d(e) {
return (e >>> 2 | e << 30) ^ (e >>> 13 | e << 19) ^ (e >>> 22 | e << 10);
}
function u(e) {
return (e >>> 6 | e << 26) ^ (e >>> 11 | e << 21) ^ (e >>> 25 | e << 7);
}
function l(e) {
return (e >>> 7 | e << 25) ^ (e >>> 18 | e << 14) ^ e >>> 3;
}
function p(e) {
return (e >>> 17 | e << 15) ^ (e >>> 19 | e << 13) ^ e >>> 10;
}
o.prototype._update = function(e) {
for (var t = this._w, r = 0 | this._a, i = 0 | this._b, n = 0 | this._c, a = 0 | this._d, f = 0 | this._e, o = 0 | this._f, b = 0 | this._g, g = 0 | this._h, m = 0; m < 16; ++m) t[m] = e.readInt32BE(4 * m);
for (;m < 64; ++m) t[m] = p(t[m - 2]) + t[m - 7] + l(t[m - 15]) + t[m - 16] | 0;
for (var y = 0; y < 64; ++y) {
var v = g + u(f) + c(f, o, b) + s[y] + t[y] | 0, _ = d(r) + h(r, i, n) | 0;
g = b;
b = o;
o = f;
f = a + v | 0;
a = n;
n = i;
i = r;
r = v + _ | 0;
}
this._a = r + this._a | 0;
this._b = i + this._b | 0;
this._c = n + this._c | 0;
this._d = a + this._d | 0;
this._e = f + this._e | 0;
this._f = o + this._f | 0;
this._g = b + this._g | 0;
this._h = g + this._h | 0;
};
o.prototype._hash = function() {
var e = a.allocUnsafe(32);
e.writeInt32BE(this._a, 0);
e.writeInt32BE(this._b, 4);
e.writeInt32BE(this._c, 8);
e.writeInt32BE(this._d, 12);
e.writeInt32BE(this._e, 16);
e.writeInt32BE(this._f, 20);
e.writeInt32BE(this._g, 24);
e.writeInt32BE(this._h, 28);
return e;
};
t.exports = o;
}, {
"./hash": 144,
inherits: 101,
"safe-buffer": 143
} ],
150: [ function(e, t, r) {
var i = e("inherits"), n = e("./sha512"), a = e("./hash"), s = e("safe-buffer").Buffer, f = new Array(160);
function o() {
this.init();
this._w = f;
a.call(this, 128, 112);
}
i(o, n);
o.prototype.init = function() {
this._ah = 3418070365;
this._bh = 1654270250;
this._ch = 2438529370;
this._dh = 355462360;
this._eh = 1731405415;
this._fh = 2394180231;
this._gh = 3675008525;
this._hh = 1203062813;
this._al = 3238371032;
this._bl = 914150663;
this._cl = 812702999;
this._dl = 4144912697;
this._el = 4290775857;
this._fl = 1750603025;
this._gl = 1694076839;
this._hl = 3204075428;
return this;
};
o.prototype._hash = function() {
var e = s.allocUnsafe(48);
function t(t, r, i) {
e.writeInt32BE(t, i);
e.writeInt32BE(r, i + 4);
}
t(this._ah, this._al, 0);
t(this._bh, this._bl, 8);
t(this._ch, this._cl, 16);
t(this._dh, this._dl, 24);
t(this._eh, this._el, 32);
t(this._fh, this._fl, 40);
return e;
};
t.exports = o;
}, {
"./hash": 144,
"./sha512": 151,
inherits: 101,
"safe-buffer": 143
} ],
151: [ function(e, t, r) {
var i = e("inherits"), n = e("./hash"), a = e("safe-buffer").Buffer, s = [ 1116352408, 3609767458, 1899447441, 602891725, 3049323471, 3964484399, 3921009573, 2173295548, 961987163, 4081628472, 1508970993, 3053834265, 2453635748, 2937671579, 2870763221, 3664609560, 3624381080, 2734883394, 310598401, 1164996542, 607225278, 1323610764, 1426881987, 3590304994, 1925078388, 4068182383, 2162078206, 991336113, 2614888103, 633803317, 3248222580, 3479774868, 3835390401, 2666613458, 4022224774, 944711139, 264347078, 2341262773, 604807628, 2007800933, 770255983, 1495990901, 1249150122, 1856431235, 1555081692, 3175218132, 1996064986, 2198950837, 2554220882, 3999719339, 2821834349, 766784016, 2952996808, 2566594879, 3210313671, 3203337956, 3336571891, 1034457026, 3584528711, 2466948901, 113926993, 3758326383, 338241895, 168717936, 666307205, 1188179964, 773529912, 1546045734, 1294757372, 1522805485, 1396182291, 2643833823, 1695183700, 2343527390, 1986661051, 1014477480, 2177026350, 1206759142, 2456956037, 344077627, 2730485921, 1290863460, 2820302411, 3158454273, 3259730800, 3505952657, 3345764771, 106217008, 3516065817, 3606008344, 3600352804, 1432725776, 4094571909, 1467031594, 275423344, 851169720, 430227734, 3100823752, 506948616, 1363258195, 659060556, 3750685593, 883997877, 3785050280, 958139571, 3318307427, 1322822218, 3812723403, 1537002063, 2003034995, 1747873779, 3602036899, 1955562222, 1575990012, 2024104815, 1125592928, 2227730452, 2716904306, 2361852424, 442776044, 2428436474, 593698344, 2756734187, 3733110249, 3204031479, 2999351573, 3329325298, 3815920427, 3391569614, 3928383900, 3515267271, 566280711, 3940187606, 3454069534, 4118630271, 4000239992, 116418474, 1914138554, 174292421, 2731055270, 289380356, 3203993006, 460393269, 320620315, 685471733, 587496836, 852142971, 1086792851, 1017036298, 365543100, 1126000580, 2618297676, 1288033470, 3409855158, 1501505948, 4234509866, 1607167915, 987167468, 1816402316, 1246189591 ], f = new Array(160);
function o() {
this.init();
this._w = f;
n.call(this, 128, 112);
}
i(o, n);
o.prototype.init = function() {
this._ah = 1779033703;
this._bh = 3144134277;
this._ch = 1013904242;
this._dh = 2773480762;
this._eh = 1359893119;
this._fh = 2600822924;
this._gh = 528734635;
this._hh = 1541459225;
this._al = 4089235720;
this._bl = 2227873595;
this._cl = 4271175723;
this._dl = 1595750129;
this._el = 2917565137;
this._fl = 725511199;
this._gl = 4215389547;
this._hl = 327033209;
return this;
};
function c(e, t, r) {
return r ^ e & (t ^ r);
}
function h(e, t, r) {
return e & t | r & (e | t);
}
function d(e, t) {
return (e >>> 28 | t << 4) ^ (t >>> 2 | e << 30) ^ (t >>> 7 | e << 25);
}
function u(e, t) {
return (e >>> 14 | t << 18) ^ (e >>> 18 | t << 14) ^ (t >>> 9 | e << 23);
}
function l(e, t) {
return (e >>> 1 | t << 31) ^ (e >>> 8 | t << 24) ^ e >>> 7;
}
function p(e, t) {
return (e >>> 1 | t << 31) ^ (e >>> 8 | t << 24) ^ (e >>> 7 | t << 25);
}
function b(e, t) {
return (e >>> 19 | t << 13) ^ (t >>> 29 | e << 3) ^ e >>> 6;
}
function g(e, t) {
return (e >>> 19 | t << 13) ^ (t >>> 29 | e << 3) ^ (e >>> 6 | t << 26);
}
function m(e, t) {
return e >>> 0 < t >>> 0 ? 1 : 0;
}
o.prototype._update = function(e) {
for (var t = this._w, r = 0 | this._ah, i = 0 | this._bh, n = 0 | this._ch, a = 0 | this._dh, f = 0 | this._eh, o = 0 | this._fh, y = 0 | this._gh, v = 0 | this._hh, _ = 0 | this._al, w = 0 | this._bl, S = 0 | this._cl, E = 0 | this._dl, M = 0 | this._el, k = 0 | this._fl, A = 0 | this._gl, x = 0 | this._hl, I = 0; I < 32; I += 2) {
t[I] = e.readInt32BE(4 * I);
t[I + 1] = e.readInt32BE(4 * I + 4);
}
for (;I < 160; I += 2) {
var R = t[I - 30], B = t[I - 30 + 1], C = l(R, B), j = p(B, R), P = b(R = t[I - 4], B = t[I - 4 + 1]), T = g(B, R), U = t[I - 14], D = t[I - 14 + 1], N = t[I - 32], O = t[I - 32 + 1], L = j + D | 0, z = C + U + m(L, j) | 0;
z = (z = z + P + m(L = L + T | 0, T) | 0) + N + m(L = L + O | 0, O) | 0;
t[I] = z;
t[I + 1] = L;
}
for (var q = 0; q < 160; q += 2) {
z = t[q];
L = t[q + 1];
var F = h(r, i, n), H = h(_, w, S), K = d(r, _), Y = d(_, r), W = u(f, M), V = u(M, f), X = s[q], G = s[q + 1], J = c(f, o, y), Z = c(M, k, A), $ = x + V | 0, Q = v + W + m($, x) | 0;
Q = (Q = (Q = Q + J + m($ = $ + Z | 0, Z) | 0) + X + m($ = $ + G | 0, G) | 0) + z + m($ = $ + L | 0, L) | 0;
var ee = Y + H | 0, te = K + F + m(ee, Y) | 0;
v = y;
x = A;
y = o;
A = k;
o = f;
k = M;
f = a + Q + m(M = E + $ | 0, E) | 0;
a = n;
E = S;
n = i;
S = w;
i = r;
w = _;
r = Q + te + m(_ = $ + ee | 0, $) | 0;
}
this._al = this._al + _ | 0;
this._bl = this._bl + w | 0;
this._cl = this._cl + S | 0;
this._dl = this._dl + E | 0;
this._el = this._el + M | 0;
this._fl = this._fl + k | 0;
this._gl = this._gl + A | 0;
this._hl = this._hl + x | 0;
this._ah = this._ah + r + m(this._al, _) | 0;
this._bh = this._bh + i + m(this._bl, w) | 0;
this._ch = this._ch + n + m(this._cl, S) | 0;
this._dh = this._dh + a + m(this._dl, E) | 0;
this._eh = this._eh + f + m(this._el, M) | 0;
this._fh = this._fh + o + m(this._fl, k) | 0;
this._gh = this._gh + y + m(this._gl, A) | 0;
this._hh = this._hh + v + m(this._hl, x) | 0;
};
o.prototype._hash = function() {
var e = a.allocUnsafe(64);
function t(t, r, i) {
e.writeInt32BE(t, i);
e.writeInt32BE(r, i + 4);
}
t(this._ah, this._al, 0);
t(this._bh, this._bl, 8);
t(this._ch, this._cl, 16);
t(this._dh, this._dl, 24);
t(this._eh, this._el, 32);
t(this._fh, this._fl, 40);
t(this._gh, this._gl, 48);
t(this._hh, this._hl, 56);
return e;
};
t.exports = o;
}, {
"./hash": 144,
inherits: 101,
"safe-buffer": 143
} ],
152: [ function(e, t, r) {
t.exports = n;
var i = e("events").EventEmitter;
e("inherits")(n, i);
n.Readable = e("readable-stream/readable.js");
n.Writable = e("readable-stream/writable.js");
n.Duplex = e("readable-stream/duplex.js");
n.Transform = e("readable-stream/transform.js");
n.PassThrough = e("readable-stream/passthrough.js");
n.Stream = n;
function n() {
i.call(this);
}
n.prototype.pipe = function(e, t) {
var r = this;
function n(t) {
e.writable && !1 === e.write(t) && r.pause && r.pause();
}
r.on("data", n);
function a() {
r.readable && r.resume && r.resume();
}
e.on("drain", a);
if (!(e._isStdio || t && !1 === t.end)) {
r.on("end", f);
r.on("close", o);
}
var s = !1;
function f() {
if (!s) {
s = !0;
e.end();
}
}
function o() {
if (!s) {
s = !0;
"function" == typeof e.destroy && e.destroy();
}
}
function c(e) {
h();
if (0 === i.listenerCount(this, "error")) throw e;
}
r.on("error", c);
e.on("error", c);
function h() {
r.removeListener("data", n);
e.removeListener("drain", a);
r.removeListener("end", f);
r.removeListener("close", o);
r.removeListener("error", c);
e.removeListener("error", c);
r.removeListener("end", h);
r.removeListener("close", h);
e.removeListener("close", h);
}
r.on("end", h);
r.on("close", h);
e.on("close", h);
e.emit("pipe", r);
return e;
};
}, {
events: 83,
inherits: 101,
"readable-stream/duplex.js": 127,
"readable-stream/passthrough.js": 138,
"readable-stream/readable.js": 139,
"readable-stream/transform.js": 140,
"readable-stream/writable.js": 141
} ],
153: [ function(e, t, r) {
var i = e("buffer").Buffer, n = i.isEncoding || function(e) {
switch (e && e.toLowerCase()) {
case "hex":
case "utf8":
case "utf-8":
case "ascii":
case "binary":
case "base64":
case "ucs2":
case "ucs-2":
case "utf16le":
case "utf-16le":
case "raw":
return !0;

default:
return !1;
}
};
var a = r.StringDecoder = function(e) {
this.encoding = (e || "utf8").toLowerCase().replace(/[-_]/, "");
(function(e) {
if (e && !n(e)) throw new Error("Unknown encoding: " + e);
})(e);
switch (this.encoding) {
case "utf8":
this.surrogateSize = 3;
break;

case "ucs2":
case "utf16le":
this.surrogateSize = 2;
this.detectIncompleteChar = f;
break;

case "base64":
this.surrogateSize = 3;
this.detectIncompleteChar = o;
break;

default:
this.write = s;
return;
}
this.charBuffer = new i(6);
this.charReceived = 0;
this.charLength = 0;
};
a.prototype.write = function(e) {
for (var t = ""; this.charLength; ) {
var r = e.length >= this.charLength - this.charReceived ? this.charLength - this.charReceived : e.length;
e.copy(this.charBuffer, this.charReceived, 0, r);
this.charReceived += r;
if (this.charReceived < this.charLength) return "";
e = e.slice(r, e.length);
if (!((n = (t = this.charBuffer.slice(0, this.charLength).toString(this.encoding)).charCodeAt(t.length - 1)) >= 55296 && n <= 56319)) {
this.charReceived = this.charLength = 0;
if (0 === e.length) return t;
break;
}
this.charLength += this.surrogateSize;
t = "";
}
this.detectIncompleteChar(e);
var i = e.length;
if (this.charLength) {
e.copy(this.charBuffer, 0, e.length - this.charReceived, i);
i -= this.charReceived;
}
var n;
i = (t += e.toString(this.encoding, 0, i)).length - 1;
if ((n = t.charCodeAt(i)) >= 55296 && n <= 56319) {
var a = this.surrogateSize;
this.charLength += a;
this.charReceived += a;
this.charBuffer.copy(this.charBuffer, a, 0, a);
e.copy(this.charBuffer, 0, 0, a);
return t.substring(0, i);
}
return t;
};
a.prototype.detectIncompleteChar = function(e) {
for (var t = e.length >= 3 ? 3 : e.length; t > 0; t--) {
var r = e[e.length - t];
if (1 == t && r >> 5 == 6) {
this.charLength = 2;
break;
}
if (t <= 2 && r >> 4 == 14) {
this.charLength = 3;
break;
}
if (t <= 3 && r >> 3 == 30) {
this.charLength = 4;
break;
}
}
this.charReceived = t;
};
a.prototype.end = function(e) {
var t = "";
e && e.length && (t = this.write(e));
if (this.charReceived) {
var r = this.charReceived, i = this.charBuffer, n = this.encoding;
t += i.slice(0, r).toString(n);
}
return t;
};
function s(e) {
return e.toString(this.encoding);
}
function f(e) {
this.charReceived = e.length % 2;
this.charLength = this.charReceived ? 2 : 0;
}
function o(e) {
this.charReceived = e.length % 3;
this.charLength = this.charReceived ? 3 : 0;
}
}, {
buffer: 47
} ],
154: [ function(e, t, r) {
(function(e) {
t.exports = function(e, t) {
if (r("noDeprecation")) return e;
var i = !1;
return function() {
if (!i) {
if (r("throwDeprecation")) throw new Error(t);
r("traceDeprecation") ? console.trace(t) : console.warn(t);
i = !0;
}
return e.apply(this, arguments);
};
};
function r(t) {
try {
if (!e.localStorage) return !1;
} catch (e) {
return !1;
}
var r = e.localStorage[t];
return null != r && "true" === String(r).toLowerCase();
}
}).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
}, {} ],
155: [ function(require, module, exports) {
var indexOf = require("indexof"), Object_keys = function(e) {
if (Object.keys) return Object.keys(e);
var t = [];
for (var r in e) t.push(r);
return t;
}, forEach = function(e, t) {
if (e.forEach) return e.forEach(t);
for (var r = 0; r < e.length; r++) t(e[r], r, e);
}, defineProp = function() {
try {
Object.defineProperty({}, "_", {});
return function(e, t, r) {
Object.defineProperty(e, t, {
writable: !0,
enumerable: !1,
configurable: !0,
value: r
});
};
} catch (e) {
return function(e, t, r) {
e[t] = r;
};
}
}(), globals = [ "Array", "Boolean", "Date", "Error", "EvalError", "Function", "Infinity", "JSON", "Math", "NaN", "Number", "Object", "RangeError", "ReferenceError", "RegExp", "String", "SyntaxError", "TypeError", "URIError", "decodeURI", "decodeURIComponent", "encodeURI", "encodeURIComponent", "escape", "eval", "isFinite", "isNaN", "parseFloat", "parseInt", "undefined", "unescape" ];
function Context() {}
Context.prototype = {};
var Script = exports.Script = function(e) {
if (!(this instanceof Script)) return new Script(e);
this.code = e;
};
Script.prototype.runInContext = function(e) {
if (!(e instanceof Context)) throw new TypeError("needs a 'context' argument.");
var t = document.createElement("iframe");
t.style || (t.style = {});
t.style.display = "none";
document.body.appendChild(t);
var r = t.contentWindow, i = r.eval, n = r.execScript;
if (!i && n) {
n.call(r, "null");
i = r.eval;
}
forEach(Object_keys(e), function(t) {
r[t] = e[t];
});
forEach(globals, function(t) {
e[t] && (r[t] = e[t]);
});
var a = Object_keys(r), s = i.call(r, this.code);
forEach(Object_keys(r), function(t) {
(t in e || -1 === indexOf(a, t)) && (e[t] = r[t]);
});
forEach(globals, function(t) {
t in e || defineProp(e, t, r[t]);
});
document.body.removeChild(t);
return s;
};
Script.prototype.runInThisContext = function() {
return eval(this.code);
};
Script.prototype.runInNewContext = function(e) {
var t = Script.createContext(e), r = this.runInContext(t);
forEach(Object_keys(t), function(r) {
e[r] = t[r];
});
return r;
};
forEach(Object_keys(Script.prototype), function(e) {
exports[e] = Script[e] = function(t) {
var r = Script(t);
return r[e].apply(r, [].slice.call(arguments, 1));
};
});
exports.createScript = function(e) {
return exports.Script(e);
};
exports.createContext = Script.createContext = function(e) {
var t = new Context();
"object" == typeof e && forEach(Object_keys(e), function(r) {
t[r] = e[r];
});
return t;
};
}, {
indexof: 100
} ],
EventName: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "b88edBS9JtJx6QRo/i6OI+p", "EventName");
t.exports = {
UPDATE_CHECK_BEFORE_DONE: "up_check_done"
};
cc._RF.pop();
}, {} ],
HotUpdate: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "0a0c8hKzQ1PFIcMW6cmy5DK", "HotUpdate");
var i = e("crypto"), n = JSON.stringify({
packageUrl: "http://192.168.50.220:5555/tutorial-hot-update/remote-assets/",
remoteManifestUrl: "http://192.168.50.220:5555/tutorial-hot-update/remote-assets/project.manifest",
remoteVersionUrl: "http://192.168.50.220:5555/tutorial-hot-update/remote-assets/version.manifest",
version: "1.10",
assets: {
"src/cocos2d-jsb.js": {
size: 3341465,
md5: "fafdde66bd0a81d1e096799fb8b7af95"
},
"src/project.dev.js": {
size: 97814,
md5: "ed7f5acd411a09d4d298db800b873b00"
},
"src/settings.js": {
size: 3849,
md5: "deb03998a4cfb8f8b468fba8575cb1c9"
},
"res/import/03/0379fb962.json": {
size: 1107,
md5: "d102d0f14ed6b6cb42cc28d88b3b9069"
},
"res/import/0c/0cd5de143.json": {
size: 80883,
md5: "f06347880038a1381043ed505d6f8a9a"
},
"res/import/0d/0d756af45.json": {
size: 10137,
md5: "02dc8b795e79b9fd62e00d4a2c70c8c1"
},
"res/import/0d/0dc6a4e59.json": {
size: 14970,
md5: "a500f696892df6869341dff5f31b1a33"
},
"res/import/41/4128b78b-00ae-4d8a-ae35-4e5ca5c5cde9.json": {
size: 76,
md5: "3f79d93ce8d42b186ecd43d868c8d023"
},
"res/import/49/49539cb0-3893-459a-b310-7cc1b7f6d335.json": {
size: 72,
md5: "8a36388cda7c3773b5bf7a53d8824535"
},
"res/import/9e/9e2ae507-fae5-4511-940b-f2e46f81b790.json": {
size: 74,
md5: "98f6b1d93a4ee3a1f2074be9ce00fbb2"
},
"res/raw-assets/0e/0ed8cf6e-8c04-4569-8d17-626a26e1099f.png": {
size: 4665,
md5: "9e8bf9af30ac7a9ea9d3b72f37a193e1"
},
"res/raw-assets/13/137d1ca6-e90c-440b-9fa2-4b9ffff569f7.png": {
size: 1627,
md5: "75060291e24294abd6a52553fa22317e"
},
"res/raw-assets/15/15d5f3f0-f965-4c00-945b-d2c8faee78b6.png": {
size: 3840,
md5: "cb525edab8063a845e6bd1e9d29b8cde"
},
"res/raw-assets/19/19509bb1-dc08-4cbf-ab8f-2460e207265c.png": {
size: 9638,
md5: "6e159c9cc1b971d3921bc8908071a70b"
},
"res/raw-assets/26/26e9a867-3d2f-4981-8a33-82d440de7aff.png": {
size: 6417,
md5: "5c139729708dd26bd461bcd3e8201823"
},
"res/raw-assets/2d/2ddfe005-2129-41d8-aeec-2b1f51f02962.png": {
size: 2290,
md5: "874dccfd88108a9f0188bda59c5df183"
},
"res/raw-assets/34/3459ab36-782c-4c4e-8aef-7280aff8b272.png": {
size: 18969,
md5: "3a810a636f3779b357e854155eafa4b6"
},
"res/raw-assets/36/36b6ea73-ff48-430e-a0c7-0e5e8defe341.png": {
size: 2711,
md5: "e64625aeb59a1de225e718a7126634ad"
},
"res/raw-assets/39/394bac82-54fb-472f-a27f-b5107821bfb8.png": {
size: 1641,
md5: "049d2201d7d99fc6dbdb017d8d8bd9b8"
},
"res/raw-assets/3c/3cedb8b4-8532-4037-a00e-b8d3e0013158.png": {
size: 94313,
md5: "a2e763866c1bdd6b189be69f3d37eedd"
},
"res/raw-assets/41/4128b78b-00ae-4d8a-ae35-4e5ca5c5cde9.manifest": {
size: 6358,
md5: "c1d18879851e567545ea04bf135a325f"
},
"res/raw-assets/49/49539cb0-3893-459a-b310-7cc1b7f6d335.mp3": {
size: 971644,
md5: "f45ec6666f06b729d8c0461bc89d4b94"
},
"res/raw-assets/4e/4e06c7f1-72ac-4e4e-90de-683e16905156.png": {
size: 2406,
md5: "5f0c28e0eed7ec0cb75e45f5937dd7c6"
},
"res/raw-assets/50/50da5486-dfa1-46d2-9d4f-686eb5527c1a.png": {
size: 6911,
md5: "51cf32529c923146f06019a58398c98d"
},
"res/raw-assets/52/5245e25c-010c-45fb-84a3-f3bce95793e7.png": {
size: 3963,
md5: "0f050ba45e09986b3d785b7b23ffcc1e"
},
"res/raw-assets/6d/6de06a23-d0de-4766-a9e1-a0314136d62e.png": {
size: 10878,
md5: "9f89eec7a1b0f615a3c1bab0857aefff"
},
"res/raw-assets/70/700faa17-11a6-46cd-aeb5-d6900bc264f8.png": {
size: 3765,
md5: "878e89a0a3e02b13beee9f3274f2ca39"
},
"res/raw-assets/71/71561142-4c83-4933-afca-cb7a17f67053.png": {
size: 1050,
md5: "c06a93f5f1a8a1c6edc4fd8b52e96cbf"
},
"res/raw-assets/80/8071df9d-029b-40e8-98f3-8eab08dbf6ca.png": {
size: 25205,
md5: "f688777a92fba11bfe85c3061a4476e5"
},
"res/raw-assets/82/82fe58d4-ae13-4806-9a41-2e73902ea811.png": {
size: 24298,
md5: "b807df8ffcb540f3dd20db75ac95b73b"
},
"res/raw-assets/83/83cc2086-d713-47a0-8d86-a8d6068b6258.png": {
size: 3782,
md5: "9827ce705349caa604e1aba1d53b0fd9"
},
"res/raw-assets/96/96e3e293-4e36-426d-a0a6-eb8d025c0d5b.png": {
size: 15379,
md5: "d6ce47aed38348a1ea0f003fa0063079"
},
"res/raw-assets/97/97a6316c-7fcb-4ffe-9045-35625bc6abf6.png": {
size: 2187,
md5: "f3f41b4c0783a751e561f1b84d91a70b"
},
"res/raw-assets/97/97bb9c9c-5568-4419-af04-4ed5a2969a02.png": {
size: 10370,
md5: "48ab94f1c34b0e9a047297cab1aeabc4"
},
"res/raw-assets/99/99170b0b-d210-46f1-b213-7d9e3f23098a.png": {
size: 1177,
md5: "d1118d133683bb4227d5e60c79c846b7"
},
"res/raw-assets/99/99acc716-33df-4c4c-879d-cc3407f0cd8c.png": {
size: 9754,
md5: "23e7221934021f3fbe6c6a52b023ded8"
},
"res/raw-assets/9e/9e2ae507-fae5-4511-940b-f2e46f81b790.mp3": {
size: 3179,
md5: "90d17b1a25200c90e292d9a3748c9fec"
},
"res/raw-assets/ac/ac11439d-3758-49f5-8728-81ed22c1ed96.png": {
size: 11935,
md5: "c20ae4a74c42b2aed28bb8c9247eb5d5"
},
"res/raw-assets/ae/ae4e2188-2b7b-42a9-85e1-8fb987600b04.png": {
size: 634171,
md5: "07b03f7145b75579708ae05ea2a2c029"
},
"res/raw-assets/af/afe329a6-e85e-46a0-98ed-8a34e128907b.png": {
size: 2209,
md5: "30ae2fe844c7c53f1d00291051230607"
},
"res/raw-assets/b2/b2037f34-04ff-4351-b9da-5be4bb557017.png": {
size: 1530,
md5: "bb96dacb8b09e0443d83462cc7b20095"
},
"res/raw-assets/b4/b43ff3c2-02bb-4874-81f7-f2dea6970f18.png": {
size: 1114,
md5: "83fcc9912e01ae5411c357651fb8b1cf"
},
"res/raw-assets/c3/c39ea496-96eb-4dc5-945a-e7c919b77c21.png": {
size: 2548,
md5: "ae7a04af25e238a5478170759b55a7ba"
},
"res/raw-assets/ca/caaaf9ff-5036-4232-a8a7-88b80b2e4c88.png": {
size: 1829,
md5: "94d761c4626df88053787f17fa09914d"
},
"res/raw-assets/ca/cacafa85-d8e9-4716-bcdb-7eba457e409c.png": {
size: 7380,
md5: "e6bb0f4d041257653f07da2dfe1edd09"
},
"res/raw-assets/ce/ce6d2de9-7056-4ba8-a1b1-40b00bb6f469.png": {
size: 10982,
md5: "52aa0df577edafe11de1cfdb44422895"
},
"res/raw-assets/cf/cfef78f1-c8df-49b7-8ed0-4c953ace2621.png": {
size: 1140,
md5: "a4b5953dffeb145b4b70072d91c4052b"
},
"res/raw-assets/d5/d5dfe6a8-eb19-4aae-a74f-83b71eaa57dc.png": {
size: 8755,
md5: "aeb1055ced334ce20fe030579e187494"
},
"res/raw-assets/da/da3e556f-1bce-4c31-87dc-897ea2d788e2.png": {
size: 11636,
md5: "d81124346c110eb1377f7b56346b31e4"
},
"res/raw-assets/e8/e851e89b-faa2-4484-bea6-5c01dd9f06e2.png": {
size: 1082,
md5: "90cf45d059d0408bec327f66eae5764c"
},
"res/raw-assets/ec/ec244ee5-6f1f-4920-9b69-d4df0e78ec2d.png": {
size: 55581,
md5: "68fdff7430b1b02f3a6e76bea92c6372"
},
"res/raw-assets/fc/fccc4d85-6ad4-496d-9b33-ea76e69da132.png": {
size: 82257,
md5: "df4359cdcb956f52f2e5b4ef777bbb7d"
}
},
searchPaths: []
});
cc.Class({
properties: {
manifestUrl: {
type: cc.Asset,
default: null
},
updateUI: cc.Node,
_updating: !1,
_canRetry: !1,
_storagePath: ""
},
init: function() {
if (cc.sys.isNative) {
this._storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "blackjack-remote-asset";
cc.log("Storage path for remote asset : " + this._storagePath);
this.versionCompareHandle = function(e, t) {
cc.log("JS Custom Version Compare: version A is " + e + ", version B is " + t);
for (var r = e.split("."), i = t.split("."), n = 0; n < r.length; ++n) {
var a = parseInt(r[n]), s = parseInt(i[n] || 0);
if (a !== s) return a - s;
}
return i.length > r.length ? -1 : 0;
};
this._am = new jsb.AssetsManager("", this._storagePath, this.versionCompareHandle);
this._am.setVerifyCallback(function(e, t) {
var r = t.compressed, n = t.md5, a = t.path, s = (t.size, jsb.fileUtils.getStringFromFile(e)), f = i.createHash("md5").update(s).digest("hex");
if (r) {
cc.log("Verification passed : " + a);
return !0;
}
cc.log("Verification passed : " + a + " (" + n + ")" + f);
return !0;
});
cc.log("Hot update is ready, please check or directly update.");
if (cc.sys.os === cc.sys.OS_ANDROID) {
this._am.setMaxConcurrentTask(2);
cc.log("Max concurrent tasks count have been limited to 2");
}
}
},
checkCb: function(e) {
cc.log("Code: " + e.getEventCode());
switch (e.getEventCode()) {
case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
cc.log("No local manifest file found, hot update skipped.");
break;

case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
cc.log("Fail to download manifest file, hot update skipped.");
break;

case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
cc.log("Already up to date with the latest remote version.");
break;

case jsb.EventAssetsManager.NEW_VERSION_FOUND:
cc.log("New version found, please try to update.");
break;

default:
return;
}
this._am.setEventCallback(null);
this._checkListener = null;
this._updating = !1;
},
updateCb: function(e) {
var t = !1, r = !1;
switch (e.getEventCode()) {
case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
this.panel.info.string = "No local manifest file found, hot update skipped.";
r = !0;
break;

case jsb.EventAssetsManager.UPDATE_PROGRESSION:
this.panel.byteProgress.progress = e.getPercent();
this.panel.fileProgress.progress = e.getPercentByFile();
this.panel.fileLabel.string = e.getDownloadedFiles() + " / " + e.getTotalFiles();
this.panel.byteLabel.string = e.getDownloadedBytes() + " / " + e.getTotalBytes();
var i = e.getMessage();
i && (this.panel.info.string = "Updated file: " + i);
break;

case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
this.panel.info.string = "Fail to download manifest file, hot update skipped.";
r = !0;
break;

case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
this.panel.info.string = "Already up to date with the latest remote version.";
r = !0;
break;

case jsb.EventAssetsManager.UPDATE_FINISHED:
this.panel.info.string = "Update finished. " + e.getMessage();
t = !0;
break;

case jsb.EventAssetsManager.UPDATE_FAILED:
this.panel.info.string = "Update failed. " + e.getMessage();
this.panel.retryBtn.active = !0;
this._updating = !1;
this._canRetry = !0;
break;

case jsb.EventAssetsManager.ERROR_UPDATING:
this.panel.info.string = "Asset update error: " + e.getAssetId() + ", " + e.getMessage();
break;

case jsb.EventAssetsManager.ERROR_DECOMPRESS:
this.panel.info.string = e.getMessage();
}
if (r) {
this._am.setEventCallback(null);
this._updateListener = null;
this._updating = !1;
}
if (t) {
this._am.setEventCallback(null);
this._updateListener = null;
var n = jsb.fileUtils.getSearchPaths(), a = this._am.getLocalManifest().getSearchPaths();
console.log(JSON.stringify(a));
Array.prototype.unshift.apply(n, a);
cc.sys.localStorage.setItem("HotUpdateSearchPaths", JSON.stringify(n));
jsb.fileUtils.setSearchPaths(n);
cc.audioEngine.stopAll();
cc.game.restart();
}
},
loadCustomManifest: function() {
if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
var e = new jsb.Manifest(n, this._storagePath);
this._am.loadLocalManifest(e, this._storagePath);
this.panel.info.string = "Using custom manifest";
}
},
retry: function() {
if (!this._updating && this._canRetry) {
this.panel.retryBtn.active = !1;
this._canRetry = !1;
this.panel.info.string = "Retry failed Assets...";
this._am.downloadFailedAssets();
}
},
checkUpdate: function() {
if (cc.sys.isNative) if (this._updating) this.panel.info.string = "Checking or updating ..."; else {
if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
cc.log("this.manifestUrl");
cc.log(JSON.stringify(this.manifestUrl));
var e = this.manifestUrl.nativeUrl;
cc.loader.md5Pipe && (e = cc.loader.md5Pipe.transformURL(e));
cc.log("url:" + e);
this._am.loadLocalManifest(e);
}
if (this._am.getLocalManifest() && this._am.getLocalManifest().isLoaded()) {
this._am.setEventCallback(this.checkCb.bind(this));
this._am.checkUpdate();
this._updating = !0;
} else cc.log("Failed to load local manifest ...");
} else cc.log("is not native, so not have check update");
},
hotUpdate: function() {
if (this._am && !this._updating) {
this._am.setEventCallback(this.updateCb.bind(this));
if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
var e = this.manifestUrl.nativeUrl;
cc.loader.md5Pipe && (e = cc.loader.md5Pipe.transformURL(e));
this._am.loadLocalManifest(e);
}
this._failCount = 0;
this._am.update();
this.panel.updateBtn.active = !1;
this._updating = !0;
}
},
show: function() {
!1 === this.updateUI.active && (this.updateUI.active = !0);
},
onDestroy: function() {
if (this._updateListener) {
this._am.setEventCallback(null);
this._updateListener = null;
}
}
});
cc._RF.pop();
}, {
crypto: 56
} ],
Log: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "a5a545zsFxI/L4OrDsMyWso", "Log");
var i = {
isDebug: !0,
log: function() {
this.isDebug && cc.log.apply(cc.log, arguments);
},
error: function() {
this.isDebug && cc.error.apply(cc.error, arguments);
}
};
window.Log = i;
cc._RF.pop();
}, {} ],
MConfig: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "d4413kHWG9HLIJD25jcD1fx", "MConfig");
window.MConfig = {
needCheckBeforeUpdate: !0,
needUpdate: !0,
continueIfFailedUpdate: !0,
urlServices: "http://192.168.1.6",
portServices: "8001",
gameName: "game_test"
};
cc._RF.pop();
}, {} ],
MGame: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "72f72r5PNtPD7P+avgkV2sT", "MGame");
var i = e("EventName"), n = {
load: function() {
MConfig.needCheckBeforeUpdate = MStorage.getBoolean(MStorageKey.NEED_CHECK_UPDATE, !0);
MConfig.needUpdate = MStorage.getBoolean(MStorageKey.NEED_CHECK_UPDATE, !0);
if (cc.sys.isBrowser) {
MConfig.needCheckBeforeUpdate = !1;
MConfig.needUpdate = !1;
}
cc.loader.loadRes("configs/config.json", function(e, t) {
cc.log("loaded configs/config.json");
cc.log(e);
cc.log(t.json);
});
},
sendCheckBeforeUpdate: function(e) {
var t = (MConfig.urlServices, MConfig.gameName);
t = "@host:@port/services/index.html".replace("@host", MConfig.urlServices).replace("@port", MConfig.portServices);
cc.error(t);
NetworkUtils.get(t, function(e, t) {
if (4 === e && "" !== t) try {
var r = JSON.parse(t);
r.again && (MConfig.needCheckBeforeUpdate = r.again);
r.continue && (MConfig.continueIfFailedUpdate = r.continue);
r.update && (MConfig.needUpdate = r.update);
} catch (e) {}
var n = new Event(i.UPDATE_CHECK_BEFORE_DONE);
n.status = e;
cc.systemEvent.dispatchEvent(n);
});
}
};
window.MGame = n;
cc._RF.pop();
}, {
EventName: "EventName"
} ],
MGlobal: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "b1b79iA3f5NOoMhRHmzYaQL", "MGlobal");
cc.Class({
extends: cc.Component,
properties: {},
start: function() {}
});
cc._RF.pop();
}, {} ],
MStorage: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "8684dkczLRJqotF00Mkg3JC", "MStorage");
var i = {
save: function(e, t) {},
get: function(e, t) {
var r = void 0;
null == e ? void 0 !== t && (r = t) : r = localStorage.getItem(e);
return r;
},
getBoolean: function(e, t) {
var r = this.get(e, t);
if (null == r) if (void 0 !== t) {
"boolean" != typeof t && cc.error("MStorage: getBoolean %s-%s, default value not is boolean value", e, t);
r = t;
} else r = !1; else r = "true" === r;
return r;
},
setBoolean: function(e, t) {
var r = "false";
if ("boolean" == typeof t) r = t ? "true" : "false"; else {
cc.error("MStorage: setBoolean %s-%s, not boolean value", e, t);
r = t ? "true" : "false";
}
this.save(e, r);
}
};
window.MStorageKey = {
NEED_UPDATE: "n_update",
NEED_CHECK_UPDATE: "n_check_update"
};
window.MStorage = i;
cc._RF.pop();
}, {} ],
NetworkUtils: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "84d361DTe1PmpeD92+t7CWv", "NetworkUtils");
var i = {
get: function(e, t) {
cc.log("get :" + JSON.stringify(e));
var r = cc.loader.getXMLHttpRequest();
r.onreadystatechange = function() {
if (4 === this.readyState) {
cc.log("receive from url: %s, readyState: %s, status: %s", e, this.readyState, this.status);
cc.log(this.responseText);
t && t(this.status, this.responseText);
}
};
r.onerror = function() {
t && t(404, "");
};
r.ontimeout = function() {
t && t(404, "");
};
r.timeout = 5e3;
r.open("GET", e, !0);
r.send();
}
};
window.NetworkUtils = i;
cc._RF.pop();
}, {} ],
SceneLoading: [ function(e, t, r) {
"use strict";
cc._RF.push(t, "a81c1ftUhJLALFhaobMUPbR", "SceneLoading");
var i = e("crypto"), n = e("../base/HotUpdate"), a = e("../base/EventName");
cc.Class({
extends: cc.Component,
properties: {
progressBar: {
default: null,
type: cc.Node
},
label: {
default: null,
type: cc.Node
},
curProcessIndex: 0,
isFree: {
serializable: !1,
visible: !1,
default: !0
},
periodUpdate: 1,
dt: {
visible: !1,
default: 0
},
hotUpdate: n
},
onLoad: function() {
cc.log("on Load");
MGame.load();
this.isFree = !0;
this.curProcessIndex = s.NONE;
this.hotUpdate = new n();
cc.systemEvent.on(a.UPDATE_CHECK_BEFORE_DONE, this.afterCheckUpdateResource, this);
},
start: function() {
var e = this.progressBar.getComponent(cc.ProgressBar), t = this.progressBar.getContentSize();
Log.log("progress bar  width:" + t.width);
Log.log("progress bar width:" + this.progressBar.width);
e.totalLength = this.progressBar.getContentSize().width;
Log.log("ahihi" + e.totalLength);
e.progress = .1;
e.progress = 1;
Log.error("progress: %s", e.progress);
cc.log("test mD5");
var r = i.createHash("md5").update("abc").digest("hex");
cc.log(r);
this.label.getComponent(cc.Label).string = r;
cc.log("------");
},
update: function(e) {
this.dt += e;
this.periodUpdate += e;
if (this.isFree && this.periodUpdate > 1) {
this.periodUpdate = 0;
this.processNext();
}
this.updateUI();
},
onDestroy: function() {
cc.log("onDestroy");
cc.systemEvent.off(a.UPDATE_CHECK_BEFORE_DONE, this.afterCheckUpdateResource, this);
},
setFree: function(e) {
this.isFree = e;
},
afterCheckUpdateResource: function(e) {
cc.log("after check update Resource:" + JSON.stringify(e));
this.setFree(!0);
},
checkUpdateResource: function() {
MConfig.needCheckBeforeUpdate ? MGame.sendCheckBeforeUpdate() : this.setFree(!0);
},
updateResource: function() {
cc.log("update Resource");
this.hotUpdate.init();
this.hotUpdate.checkUpdate();
this.isFree = !0;
},
afterUpdateResource: function() {
this.isFree = !0;
},
loadResource: function() {
cc.log("loadResource");
this.isFree = !0;
},
afterLoadDone: function() {
cc.director.preloadScene("SceneMenu", function(e, t, r) {}, function(e) {
cc.director.loadScene("SceneMenu");
});
},
processNext: function() {
this.curProcessIndex++;
cc.log("processNext:" + s[this.curProcessIndex]);
this.isFree = !1;
switch (this.curProcessIndex) {
case s.NONE:
return;

case s.CHECK_BEFORE_UPDATE:
this.checkUpdateResource();
break;

case s.UPDATE:
this.updateResource();
break;

case s.AFTER_UPDATE:
this.afterUpdateResource();
break;

case s.LOAD_RESOURCE:
this.loadResource();
break;

case s.AFTER_DONE:
this.afterLoadDone();
}
},
updateUI: function() {}
});
var s = cc.Enum({
NONE: 1,
CHECK_BEFORE_UPDATE: 2,
UPDATE: 3,
AFTER_UPDATE: 4,
LOAD_RESOURCE: 5,
AFTER_DONE: 6
});
cc._RF.pop();
}, {
"../base/EventName": "EventName",
"../base/HotUpdate": "HotUpdate",
crypto: 56
} ]
}, {}, [ "EventName", "HotUpdate", "Log", "MConfig", "MGame", "MGlobal", "MStorage", "NetworkUtils", "SceneLoading" ]);