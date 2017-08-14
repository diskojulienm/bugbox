export const panelStyles = `
*,
*:before,
*:after { margin: 0; padding: 0; outline: 0; box-sizing: border-box; }

body { font-family: Arial, sans-serif; font-size: 14px; color: #555; line-height: 1.2; overflow: hidden; }

img { display: inline-block; vertical-align: middle; max-width: 100%; height: auto; }

p { margin-bottom: 1.2em; }
p:last-child { margin-bottom: 0; }

a { color: #03a9f4; text-decoration: none; }
a:hover { text-decoration: underline; }

::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: #fff; }
::-webkit-scrollbar-thumb { border-radius: 3px; background: #03a9f4; border: 1px solid #fff; }

/* ------------------------------------------------------------ *\
	Animations
\* ------------------------------------------------------------ */

@keyframes loadingDot {
	0%  { transform: translateY(0); }
	35% { transform: translateY(0); opacity: .3; }
	50% { transform: translateY(-83.33%); opacity: .8; }
	70% { transform: translateY(33.33%); opacity: .6; }
	85% { transform: translateY(0); }
}

/* ------------------------------------------------------------ *\
	Transitions
\* ------------------------------------------------------------ */

.fade-enter-active,
.fade-leave-active { transition: opacity .2s; }

.fade-enter,
.fade-leave-to { opacity: 0; }

.fade-left-enter-active,
.fade-left-leave-active { transition: opacity .2s, transform .2s; }

.fade-left-enter { transform: translateX(10%); opacity: 0; }
.fade-left-leave-to { transform: translateX(-10%); opacity: 0; }

/* ------------------------------------------------------------ *\
	Buttons
\* ------------------------------------------------------------ */

.btn { display: inline-block; vertical-align: middle; padding: 10px 12px; background: #03a9f4; border: 0; border-radius: 2px; color: #fff; text-decoration: none; text-transform: uppercase; font-weight: bold; font-size: 12px; text-align: center; cursor: pointer; transition: all .2s; }
.btn:hover { background: #0391cd; text-decoration: none; }

.btn--full { width: 100%; }

.btn--success { background: #8bc34a; }
.btn--success:hover { background: #75a838; }

.btn--danger { background: #f44336; }
.btn--danger:hover { background: #f12112; }

/* ------------------------------------------------------------ *\
	Loader
\* ------------------------------------------------------------ */

.loader { position: absolute; z-index: 100; left: 50%; top: 50%; transform: translate(-50%, -50%); font-size: 0; }

.loader .loader__dot { display: inline-block; vertical-align: top; width: 6px; height: 6px; background: #888; border-radius: 50%; animation: loadingDot 1.5s infinite; }
.loader .loader__dot + .loader__dot { margin-left: 4px; }

.loader .loader__dot:nth-child(2) { animation-delay: .15s; }
.loader .loader__dot:nth-child(3) { animation-delay: .3s; }

/* ------------------------------------------------------------ *\
	Form Elements
\* ------------------------------------------------------------ */

.field { width: 100%; height: 30px; padding: 0 8px; border: 1px solid #ddd; border-radius: 2px; font-family: inherit; transition: border .2s; }

.textarea { width: 100%; padding: 6px 8px; border: 1px solid #ddd; border-radius: 2px; font-family: inherit; transition: border .2s; }

.field:focus,
.textarea:focus { border-color: #03a9f4; }

.select select { width: 100%; height: 30px; padding: 0 4px; border: 1px solid #ddd; border-radius: 2px; font-family: inherit; }

.radio { position: relative; display: block; padding-left: 20px; }

.radio .radio__input { position: absolute; left: 0; top: 6px; }
.radio .radio__label { display: block; padding: 4px 0; word-break: break-all; }

/* ------------------------------------------------------------ *\
	Form
\* ------------------------------------------------------------ */

.form { padding: 8px; }
.form form { transition: all .2s; }

.form .form__row { margin-bottom: 10px; }
.form .form__row:last-child { margin-bottom: 0; }

.form .form__label { display: block; margin-bottom: 4px; font-weight: bold; font-size: 13px; }

.form .form__preview { position: relative; display: inline-block; vertical-align: top; max-width: 200px; max-height: 200px; min-width: 20px; min-height: 20px; border: 2px solid #ddd; }
.form .form__preview img { max-width: 100%; max-height: 100%; height: auto; width: auto; }

.form .form__preview-remove { position: absolute; right: 2px; top: 2px; width: 12px; height: 12px; background: rgba(0,0,0,.1); line-height: 12px; text-align: center; text-decoration: none; color: #f44336; transition: all .2s; }
.form .form__preview-remove:hover { background: none; }

/*  Form Loading  */

.form--loading { position: relative; }
.form--loading form { opacity: .5; pointer-events: none; }


/* ------------------------------------------------------------ *\
	Table
\* ------------------------------------------------------------ */

.table table { width: 100%; border: 1px solid #ddd; border-spacing: 0; }

.table th,
.table td { padding: 8px; border-bottom: 1px solid #ddd; font-size: 12px; text-align: left; }

.table th { width: 25%; font-weight: bold; border-right: 1px solid #f5f5f5; }

.table tr:last-child th,
.table tr:last-child td { border-bottom: 0; }

/* ------------------------------------------------------------ *\
	Panel
\* ------------------------------------------------------------ */

.panel { position: relative; height: 100%; min-width: 300px; padding: 50px 0 0; margin-left: 35px; background: #fff; box-shadow: 0 10px 30px 0 rgba(0,0,0,.1); transition: all .2s; }

.panel .panel__toggle { position: absolute; right: 100%; bottom: 10px; width: 30px; height: 30px; line-height: 30px; background: #fff; border: 0; border-radius: 2px 0 0 2px; text-align: center; box-shadow: -2px 2px 3px 0 rgba(0,0,0,.1); cursor: pointer; }
.panel .panel__toggle:hover { background: #eee; text-decoration: none; transition: all .2s; }
.panel .panel__toggle img { transform: rotate(180deg); transition: all .2s; }

.panel .panel__head { position: absolute; z-index: 10; left: 0; top: 0; display: flex; align-items: center; width: 100%; height: 50px; padding: 8px; border-bottom: 1px solid #ddd; box-shadow: 0 2px 3px 0 rgba(0,0,0,.1); }
.panel .panel__body { max-height: 100%; overflow: hidden; overflow-y: auto; }

.panel .panel__dropdown { position: relative; margin-left: auto; }

.panel .panel__dropdown-trigger { display: block; height: 34px; padding: 8px 12px; line-height: 34px; font-size: 0; line-height: 0; text-indent: -10000px; }

.panel .panel__dropdown-trigger:before,
.panel .panel__dropdown-trigger:after { content: ''; }

.panel .panel__dropdown-trigger:before,
.panel .panel__dropdown-trigger:after,
.panel .panel__dropdown-trigger i { display: block; width: 4px; height: 4px; background: #ccc; border-radius: 50%; transition: all .2s; }

.panel .panel__dropdown-trigger i { margin: 3px 0; }

.panel .panel__dropdown-menu { position: absolute; right: 0; top: 100%; width: 200px; background: #fff; border: 1px solid #ddd; border-radius: 2px; box-shadow: 0 4px 8px 0 rgba(0,0,0,.15); list-style: none outside none; overflow: hidden; visibility: hidden; opacity: 0; transition: all .2s; }
.panel .panel__dropdown-menu li { padding: 8px; border-bottom: 1px solid #eee; }
.panel .panel__dropdown-menu li:last-child { border-bottom: 0; }

.panel .panel__dropdown:hover .panel__dropdown-trigger:before,
.panel .panel__dropdown:hover .panel__dropdown-trigger:after,
.panel .panel__dropdown:hover .panel__dropdown-trigger i { background: #03a9f4; }

.panel .panel__dropdown:hover .panel__dropdown-menu { visibility: visible; opacity: 1; }

/*  Panel Collapsed  */
.panel--collapsed { box-shadow: none; }
.panel--collapsed .panel__toggle img { transform: none; }


/* ------------------------------------------------------------ *\
	User
\* ------------------------------------------------------------ */

.user .user__name { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.user .user__name img { display: inline-block; vertical-align: middle; width: 24px; height: 24px; border-radius: 2px; margin-right: 2px; }


/* ------------------------------------------------------------ *\
	Issues
\* ------------------------------------------------------------ */

.issues .issues__message { padding: 12px 8px; text-align: center; font-style: italic; opacity: .5; }


/* ------------------------------------------------------------ *\
	Issue
\* ------------------------------------------------------------ */

.issue { position: relative; padding: 8px; border-bottom: 1px solid #eee; font-size: 13px; cursor: pointer; transition: all .2s; }
.issue:hover { background: #eee; }

.issue .issue__inner { position: relative; padding-left: 20px; }

.issue .issue__link { position: absolute; left: 1px; top: 1px; width: 14px; }

.issue .issue__title { font-size: 1em; font-weight: normal; }

.issue .issue__meta { margin-top: 4px; font-size: .9em; opacity: .5; }


/* ------------------------------------------------------------ *\
	Issue Details
\* ------------------------------------------------------------ */

.issue-details .issue__back { display: block; padding: 12px 8px; background: #eee; border-bottom: 1px solid #ddd; color: #555; text-decoration: none; transition: all .2s; }
.issue-details .issue__back:hover { background: #fff; }

.issue-details .issue__inner { padding: 12px 8px; }

.issue-details .issue__title { margin-bottom: 8px; font-size: 16px; }

.issue-details .issue__description { margin-bottom: 12px; }

.issue-details .issue__meta { margin-bottom: 10px; }

.issue-details .issue__link img { display: inline-block; vertical-align: middle; margin-right: 5px; }

.issue-details .issue__screenshots { margin-bottom: 12px; }

.issue-details .issue__screenshots strong { display: block; margin-bottom: 4px; }
.issue-details .issue__screenshots ul { list-style: none outside none; }
.issue-details .issue__screenshots li { display: inline-block; vertical-align: top; width: 70px; height: 50px; margin-right: 10px; border: 2px solid #ddd; transition: all .2s; }
.issue-details .issue__screenshots li:hover { border-color: #ccc; }
.issue-details .issue__screenshots a { display: block; }
.issue-details .issue__screenshots img { width: 100%; height: auto; }


/* ------------------------------------------------------------ *\
	Call to Action
\* ------------------------------------------------------------ */

.cta { padding: 12px 8px; }

/* ------------------------------------------------------------ *\
	Lists
\* ------------------------------------------------------------ */

/*  List Urls  */

.list-urls { list-style: none outside none; }

.list-urls .list-urls__custom .field { visibility: hidden; opacity: 0; }
.list-urls .list-urls__custom .radio__input:checked ~ .field { visibility: visible; opacity: 1; }

`;
