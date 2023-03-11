<script>
    import {END_POINT} from "../constants.js";
    import {onMount} from "svelte";

    let on_new_subject = false;
    let on_modify_subject = false;

    let on_modify_topic = false;

    let subject_progress_value = 0;

    let periods;

    let topics;

    let isAdmin = false;

    async function getPeriods() {
        const req = await fetch(`${END_POINT}/api/period/get_periods`)
        const res = await req.json();

        if (req.ok) {
            periods = res;
            selected_period = periods[0];
            if (personnelId === '499210' || personnelId === '999176' || personnelId === 'admin') {
                isAdmin = true;
                await getUnits();
            } else {
                isAdmin = false;
                if (personnelId === 'logistic') {
                    selected_unit = {
                        id: '3J1KvXOB4rrU3M5TCTX0',
                        title: 'مدیریت فورواردی و لجستیک'
                    }
                    sso_workPlaceName.set('مدیریت فورواردی و لجستیک');
                    sso_departmentName.set('مدیریت فورواردی و لجستیک');
                }else if (personnelId === '968089') {
                    selected_unit = {
                        id: '84428q3gPXcmLdiZv6XW',
                        title: 'مدیریت سرمایه گذاری و پیمان'
                    }
                    sso_workPlaceName.set('مدیریت سرمایه گذاری و پیمان');
                    sso_departmentName.set('مدیریت سرمایه گذاری و پیمان');
                }else if (personnelId === 'bahadori') {
                    selected_unit = {
                        id: '3MT2LjsDrYa7h8QitLaf',
                        title: 'شعبه پایانه کانتینری و منطقه دو ویژه اقتصادی بندر بوشهر'
                    }
                    sso_workPlaceName.set('شعبه پایانه کانتینری و منطقه دو ویژه اقتصادی بندر بوشهر');
                    sso_departmentName.set('شعبه پایانه کانتینری و منطقه دو ویژه اقتصادی بندر بوشهر');
                }
                else if (personnelId === 'moji') {
                    selected_unit = {
                        id: '2Yk4WkNz6JP3NOXAYzJH',
                        title: 'شعبه پایانه کالای عمومی و جزیره نگین بوشهر'
                    }
                    sso_workPlaceName.set('شعبه پایانه کالای عمومی و جزیره نگین بوشهر');
                    sso_departmentName.set('شعبه پایانه کالای عمومی و جزیره نگین بوشهر');
                }
                topics = getTopics();
                the_selected_topic.set(undefined);
            }
            // console.log(periods);
            // if (requests.length < 10)
            //     show_more_visible = false;
        } else {
            // show_more_visible = false;
        }
    }

    let units;
    let selected_unit;

    async function getUnits() {
        const req = await fetch(`${END_POINT}/api/unit/get_units`)
        const res = await req.json();

        if (req.ok) {
            units = res;
            selected_unit = units[0];
            // console.log(periods);
            // if (requests.length < 10)
            //     show_more_visible = false;
        } else {
            // show_more_visible = false;
        }
    }

    async function getTopics() {
        if (selected_period && selected_unit) {
            const req = await fetch(`${END_POINT}/api/topic/get_topics?periodId=${selected_period.id}&unitId=${selected_unit.id}`)
            const res = await req.json();

            if (req.ok) {
                // console.log(res);
                return res;
                // if (requests.length < 10)
                //     show_more_visible = false;
            } else {
                // show_more_visible = false;
            }
        }
    }

    let selected_topic;

    let selected_period;

    let subjects;

    let unitId = "SNvkIXRTy42g4ZrlEZcP";
    // let unitId = "1001";

    let personnelId;

    sso_personCode.subscribe(value => {
        personnelId = value;
    });


    async function getTopicSubjects() {
        let topicId = -1;
        if (selected_topic)
            topicId = selected_topic.id;
        else return;

        const req = await fetch(`${END_POINT}/api/subject/get_topic_subjects?topicId=${topicId}&unitId=${selected_unit.id}`)
        const res = await req.json();

        if (req.ok) {
            grouped_items = groupByCategory(res);
            console.log(grouped_items);
            // console.log(grouped_items)
            return res;
            // if (requests.length < 10)
            //     show_more_visible = false;
        } else {
            // show_more_visible = false;
        }
    }

    // create subject

    let subject_on_delete = {
        id: ''
    }

    let subject_on_create = {
        topicId: '',
        unitId,
        personnelId,
        title: '',
        description: '',
        progress: 0,
        weight: 0,
        normalWeight: 0,
        comment: ''
    }

    let subject_on_modify = {
        id: '',
        topicId: '',
        unitId,
        personnelId,
        title: '',
        locked: false,
        description: '',
        progress: 0,
        weight: 0,
        normalWeight: 0,
        category: '',
        isAdmin: false,
        comment: '',
        progressLocked: false
    }

    let topic_on_modify = {
        id: '',
        title: '',
        progress: ''
    }

    async function createSubjectOnTopic() {

        const form_body = new FormData();
        form_body.append('topicId', subject_on_create.topicId);
        form_body.append('unitId', selected_unit.id);
        form_body.append('personnelId', subject_on_create.personnelId);
        form_body.append('title', subject_on_create.title);
        form_body.append('description', subject_on_create.description);
        form_body.append('progress', subject_on_create.progress);
        form_body.append('weight', subject_on_create.weight);
        form_body.append('normalWeight', subject_on_create.normalWeight);
        form_body.append('category', selected_category.id);
        form_body.append('comment', subject_on_create.comment);

        const req = await fetch(`${END_POINT}/api/subject/create_subject`, {
            method: 'POST',
            body: form_body
        })
        const res = await req.json();

        if (req.ok) {
            subjects = await getTopicSubjects();
            on_new_subject = false;
            // if (requests.length < 10)
            //     show_more_visible = false;
        } else {
            // show_more_visible = false;
        }

        subject_on_create = {
            topicId: subject_on_create.topicId,
            unitId: subject_on_create.unitId,
            personnelId,
            title: '',
            description: '',
            progress: 0,
            weight: 0,
            normalWeight: 0,
            category: subject_on_create.category,
            comment: ''
        };

        // on_new_subject = false;
    }

    async function modifySubject() {
        const form_body = new FormData();
        form_body.append('id', subject_on_modify.id);
        form_body.append('topicId', subject_on_modify.topicId);
        form_body.append('unitId', subject_on_modify.unitId);
        form_body.append('personnelId', subject_on_modify.personnelId);
        form_body.append('title', subject_on_modify.title);
        form_body.append('description', subject_on_modify.description);
        form_body.append('progress', subject_on_modify.progress);
        form_body.append('weight', subject_on_modify.weight);
        form_body.append('normalWeight', subject_on_modify.normalWeight);
        form_body.append('category', subject_on_modify.category);
        form_body.append('comment', subject_on_modify.comment);

        const req = await fetch(`${END_POINT}/api/subject/update_subject`, {
            method: 'POST',
            body: form_body
        })
        const res = await req.json();

        if (req.ok) {
            subjects = await getTopicSubjects();
            // if (requests.length < 10)
            //     show_more_visible = false;
        } else {
            // show_more_visible = false;
        }

        on_modify_subject = false;
    }

    import {page} from '$app/stores';
    import {goto} from "$app/navigation";

    let opened_topic = undefined;

    import {
        gen_token,
        sso_departmentName,
        sso_firstName,
        sso_lastName,
        sso_personCode,
        sso_workPlaceSlug,
        sso_workPlaceName,
        sso_departmentId,
        the_selected_topic, authenticated
    } from "../stores.js";

    let the_token;
    let firstName;
    let lastName;
    let departmentName;
    let departmentId;
    let workPlaceSlug;
    let workPlaceName;

    gen_token.subscribe(value => {
        the_token = value;
    })

    sso_firstName.subscribe(value => {
        firstName = value;
    });

    sso_lastName.subscribe(value => {
        lastName = value;
    });

    sso_departmentName.subscribe(value => {
        departmentName = value;
    });

    sso_departmentId.subscribe(value => {
        departmentId = value;
    });

    sso_workPlaceSlug.subscribe(value => {
        workPlaceSlug = value;
    });

    sso_workPlaceName.subscribe(value => {
        workPlaceName = value;
    });

    the_selected_topic.subscribe(value => {
        selected_topic = value;
    });

    let is_authenticated;

    authenticated.subscribe(value => {
        is_authenticated = value;
    });

    onMount(async () => {
        let params = $page.url.searchParams;
        if (params.has("token")) {
            gen_token.set(params?.get('token'));
            authenticated.set(true);
            await goto('/', {replaceState: false})
        } else if (!is_authenticated || the_token === undefined || the_token === -1) {
            await goto('/authenticate');
        }

        if (is_authenticated) {
            if (personnelId === '499210' || personnelId === '999176' || personnelId === 'admin') {
                isAdmin = true;
            }
        }
        if (the_token !== 1) {
            await getInformation();
        } else {
            await getPeriods();
        }

        // topics = getTopics();
    });

    async function getInformation() {
        if (the_token) {

            const req = await fetch(`${END_POINT}/api/personnel/get_information?token=${the_token}`)
            const resj = await req.json();
            try {
                const res = JSON.parse(resj);
                sso_firstName.set(res.firstName);
                sso_lastName.set(res.lastName);
                sso_departmentName.set(res.departmentName);
                sso_departmentId.set(res.departmentSlug)
                sso_workPlaceSlug.set(res.workPlaceSlug);
                sso_workPlaceName.set(res.workPlaceSlugName);
                sso_personCode.set(res.personCode);
                if (workPlaceSlug === 'wJCPQ8MALTlDMoYFS4Gt') {
                    selected_unit = {
                        id: departmentId,
                        title: departmentName
                    };
                } else {
                    selected_unit = {
                        id: workPlaceSlug,
                        title: workPlaceName
                    };
                }
                await getPeriods();
            } catch (e) {

            }
        }
    }

    async function submitTopicProgress() {
        const form_body = new FormData();
        form_body.append('topicId', topic_on_modify.id);
        form_body.append('unitId', selected_unit.id);
        form_body.append('progress', topic_on_modify.progress);

        const req = await fetch(`${END_POINT}/api/topic/set_progress`, {
            method: 'POST',
            body: form_body
        })
        const res = await req.json();

        if (req.ok) {
            topics = await getTopics();
            // if (requests.length < 10)
            //     show_more_visible = false;
        } else {
            // show_more_visible = false;
        }

        on_modify_topic = false;
        the_selected_topic.set(undefined);
    }

    async function removeSubject(subjectId) {

        const form_body = new FormData();
        form_body.append('subjectId', subjectId);

        const req = await fetch(`${END_POINT}/api/subject/delete_subject`, {
            method: 'POST',
            body: form_body
        })
        const res = await req.json();

        if (req.ok) {
            subjects = await getTopicSubjects();
            // if (requests.length < 10)
            //     show_more_visible = false;
        } else {
            // show_more_visible = false;
        }

        on_delete = false;
    }

    // let previous_topic;

    $: {
        if (isAdmin && selected_unit) {
            topics = getTopics();
            the_selected_topic.set(undefined);
        }
    }

    import {fly, fade} from 'svelte/transition';

    import _ from 'lodash';

    let grouped_items = {};

    function groupByCategory(list) {
        let result = _.mapValues(_.groupBy(list, 'category'),
            items => items.map(car => _.omit(car, 'category')));
        return result;
    }

    let selected_category;

    let categories;

    async function getCategories() {
        // if (selected_category) {

        const req = await fetch(`${END_POINT}/api/topic/get_categories?topicId=${selected_topic.id}`)
        const res = await req.json();

        if (req.ok) {
            categories = res;
            if (categories.length > 0)
                selected_category = categories[0];
            // if (requests.length < 10)
            //     show_more_visible = false;
        } else {
            // show_more_visible = false;
        }
        // }
    }

    let is_create_form_complete = false;

    $: {
        is_create_form_complete =
            subject_on_create
            && subject_on_create.title
            && subject_on_create.category
            && subject_on_create.title.length > 0
            && subject_on_create.category.length > 0;
    }

    let is_modify_form_complete = false;

    $: {
        is_modify_form_complete =
            subject_on_modify
            && subject_on_modify.title
            && subject_on_modify.category
            && subject_on_modify.title.length > 0
            && subject_on_modify.category.length > 0;
    }

    let on_show_documents = false;

    let subject_on_show_documents = {
        id: -1,
        attachments: [],
        to_be_attached: []
    }

    let on_delete = false;

    async function confirmSubject(id, unitId) {

        const form_body = new FormData();
        form_body.append('subjectId', id);
        form_body.append('unitId', unitId);

        const req = await fetch(`${END_POINT}/api/subject/confirm`, {
            method: 'POST',
            body: form_body
        })
        const res = await req.json();

        if (req.ok) {
            subjects = await getTopicSubjects();
            // if (requests.length < 10)
            //     show_more_visible = false;
        } else {
            // show_more_visible = false;
        }

        on_modify_subject = false;
    }

    async function takeBackConfirmSubject(id, unitId) {

        const form_body = new FormData();
        form_body.append('subjectId', id);
        form_body.append('unitId', unitId);

        const req = await fetch(`${END_POINT}/api/subject/take_back_confirm`, {
            method: 'POST',
            body: form_body
        })
        const res = await req.json();

        if (req.ok) {
            subjects = await getTopicSubjects();
            // if (requests.length < 10)
            //     show_more_visible = false;
        } else {
            // show_more_visible = false;
        }

        on_modify_subject = false;
    }

    async function confirmTopic(id, unitId) {

        const form_body = new FormData();
        form_body.append('topicId', id);
        form_body.append('unitId', unitId);

        const req = await fetch(`${END_POINT}/api/topic/confirm`, {
            method: 'POST',
            body: form_body
        })
        const res = await req.json();

        if (req.ok) {
            topics = await getTopics();
            the_selected_topic.set(undefined);
            // if (requests.length < 10)
            //     show_more_visible = false;
        } else {
            // show_more_visible = false;
        }
    }

    async function takeBackConfirmTopic(id, unitId) {
        const form_body = new FormData();
        form_body.append('topicId', id);
        form_body.append('unitId', unitId);

        const req = await fetch(`${END_POINT}/api/topic/take_back_confirm`, {
            method: 'POST',
            body: form_body
        })
        const res = await req.json();

        if (req.ok) {
            topics = await getTopics();
            the_selected_topic.set(undefined);
            // if (requests.length < 10)
            //     show_more_visible = false;
        } else {
            // show_more_visible = false;
        }
    }

    function remove_attachment(file) {
        subject_on_show_documents.to_be_attached = Array.from(subject_on_show_documents.to_be_attached).filter(f => (
            f.name !== file.name && f.size !== file.size
        ));
    }

    let on_upload = false;

    async function uploadDoc() {
        on_upload = true;
        console.log(JSON.stringify(subject_on_show_documents));

        const form_body = new FormData();
        form_body.append('id', subject_on_show_documents.id);
        form_body.append('isAdmin', false);

        if (subject_on_show_documents.to_be_attached !== undefined) {
            let all_attachments = Array.from(subject_on_show_documents.to_be_attached);
            for (let i = 0; i < all_attachments.length; i++) {
                form_body.append('attachments', all_attachments[i]);
            }
        }

        console.log('ready to submit');
        console.log(subject_on_show_documents);

        const req = await fetch(`${END_POINT}/api/subject/upload_docs`, {
            method: 'POST',
            body: form_body
        })
        const res = await req.json();

        if (req.ok) {
            subjects = await getTopicSubjects();
            on_upload = false;
            on_show_documents = false;
            subject_on_show_documents = {
                id: '',
                attachments: [],
                to_be_attached: []
            };
        } else {
        }
    }

    async function removeDocument(id) {

        const form_body = new FormData();
        form_body.append('fileId', id);

        const req = await fetch(`${END_POINT}/api/subject/attachments/remove`, {
            method: 'POST',
            body: form_body
        })
        const res = await req.json();

        if (req.ok) {
            subjects = await getTopicSubjects();
            on_show_documents = false;
        } else {
            // show_more_visible = false;
        }
    }

    function get_file_extension(fileName) {
        let name = fileName.toString();
        return name.substring(name.lastIndexOf("."));
    }


</script>

<svelte:head>
    <title>خدمات دریایی سینا | مدیریت موضوعات</title>
</svelte:head>

<div class="bg-gray-100 overflow-hidden relative">
    {#if on_new_subject || on_modify_subject || on_show_documents || on_delete}
        <div class="bg-black/60 backdrop-opacity-50 w-screen h-screen fixed top-0 right-0 z-20">
            <dialog in:fly="{{ y: -100, duration: 200 }}" out:fly="{{ y: -100, duration: 200 }}"
                    class="z-20 w-full md:w-3/5 drop-shadow-xl top-24 p-0 dialog-box"
                    open="{on_new_subject || on_modify_subject || on_show_documents || on_delete ? 'open':''}">
                {#if on_new_subject}
                    <div>
                        <div style="background-color: #3C8DBC"
                             class="px-4 py-4 flex flex-row items-center text-white">
                            <h1 class="font-bold">ثبت عنوان جدید در این موضوع</h1>
                        </div>
                        <hr/>
                        <div class="flex flex-col py-2 px-2 gap-2">
                            <div class="flex flex-col gap-2 text-sm">
                                <label for="selected_topic_category">دسته بندی</label>
                                {#if selected_category}
                                    <select id="selected_topic_category"
                                            class="border-2 border-gray-100 w-full mb-4"
                                            bind:value={subject_on_create.category}>
                                        {#each Array.from(categories) as category}
                                            <option value="{category.id}">{category.name}</option>
                                        {/each}
                                    </select>
                                {:else}
                                    <select disabled
                                            class="border-2 border-gray-100 w-full mb-4 shimmer-effect text-gray-400">
                                        <option>در حال بارگزاری</option>
                                    </select>
                                {/if}
                                <!--                            <input bind:value={subject_on_create.title}-->
                                <!--                                   id="selected_topic_title"-->
                                <!--                                   class="border-2 border-gray-100 py-2 px-2 rounded-sm"-->
                                <!--                                   type="text" placeholder="موضوع شماره یک"/>-->
                            </div>
                            <div class="flex flex-col gap-2 text-sm">
                                <label for="selected_topic_title">موضوع</label>
                                <textarea bind:value={subject_on_create.title}
                                          id="selected_topic_title"
                                          class="border-2 border-gray-100 py-2 px-2 rounded-sm"
                                          type="text" placeholder="موضوع شماره یک"></textarea>
                            </div>
                            <div class="flex flex-col gap-2 text-sm">
                                <label for="selected_topic_description">توضیحات</label>
                                <textarea bind:value={subject_on_create.description}
                                          id="selected_topic_description"
                                          class="border-2 border-gray-100 py-2 px-2 rounded-sm"></textarea>
                            </div>
                            <div class="flex flex-col gap-2 text-sm">
                                <label for="selected_topic_comment">نقطه نظر</label>
                                <textarea bind:value={subject_on_create.comment}
                                          id="selected_topic_comment"
                                          class="border-2 border-gray-100 py-2 px-2 rounded-sm"></textarea>
                            </div>
                            <div class="flex flex-row gap-2 text-sm">
                                <!--                                <div class="flex flex-col gap-2 text-sm grow">-->
                                <!--                                    <label for="selected_topic_weight">وزن موضوع</label>-->
                                <!--                                    <input bind:value={subject_on_create.weight}-->
                                <!--                                           id="selected_topic_weight"-->
                                <!--                                           class="border-2 border-gray-100 py-2 px-2 rounded-sm"-->
                                <!--                                           type="number" placeholder="مثال: 4.5"/>-->
                                <!--                                </div>-->
                                <!--                    <div class="flex flex-col gap-2 text-sm grow">-->
                                <!--                        <label for="selected_topic_normal_weight">موضوع</label>-->
                                <!--                        <input id="selected_topic_normal_weight" class="border-2 border-gray-100 py-2 px-2 rounded-sm"-->
                                <!--                               type="text" placeholder="موضوع شماره یک" />-->
                                <!--                    </div>-->
                            </div>
                            <div class="flex flex-col gap-2 text-sm">
                                <div class="flex flex-row items-center">
                                    <label for="selected_topic_progress">امتیاز/درصد پیشرفت</label>
                                    <span class="mr-auto">{subject_on_create.progress}/100</span>
                                </div>
                                <input type="range" bind:value={subject_on_create.progress} min=0 max=100
                                       id="selected_topic_progress" class="py-2"
                                       placeholder="موضوع شماره یک"/>
                            </div>

                        </div>
                        <div class="px-2 text-left pb-2">
                            <button disabled={!is_create_form_complete}
                                    on:click={() => createSubjectOnTopic()}
                                    class="{is_create_form_complete ? 'bg-blue-500':'bg-slate-500'} text-white py-2 {is_create_form_complete ? 'hover:bg-blue-600':'hover:bg-slate-600'} rounded-sm mr-auto px-8">
                                ثبت
                            </button>
                            <button on:click={() => {
                                on_new_subject = !on_new_subject;
                                subject_on_create = {
                                    topicId: subject_on_create.topicId,
                                    unitId: subject_on_create.unitId,
                                    personnelId,
                                    title: '',
                                    description: '',
                                    progress: 0,
                                    weight: 0,
                                    normalWeight: 0,
                                    category: subject_on_create.category
                                };
                            }}
                                    class="bg-slate-500 text-white px-6 py-2 hover:bg-slate-600 rounded-sm">لغو
                            </button>
                        </div>
                    </div>
                {/if}
                {#if on_modify_subject}
                    <div>
                        <div style="background-color: #3C8DBC"
                             class="px-4 py-4 flex flex-row items-center text-white">
                            <h1 class="font-bold">ویرایش عنوان انتخاب شده</h1>
                            {#if on_new_subject}
                                <i on:click={() => {
                                    on_new_subject = !on_new_subject;
                                }}
                                   class="bi bi-dash-square flex text-xl text-red-500 hover:text-red-700 cursor-pointer mr-auto"></i>
                            {/if}
                        </div>
                        <hr/>
                        <div class="flex flex-col py-2 px-2 gap-2">
                            {#if !subject_on_modify.isAdmin}
                                <div class="flex flex-col gap-2 text-sm">
                                    <label for="mselected_topic_category">دسته بندی</label>
                                    {#if selected_category}
                                        <select disabled={subject_on_modify.isAdmin}
                                                id="mselected_topic_category"
                                                class="border-2 border-gray-100 w-full mb-4"
                                                bind:value={subject_on_modify.category}>
                                            {#each Array.from(categories) as category}
                                                <option value="{category.id}">{category.name}</option>
                                            {/each}
                                        </select>
                                    {:else}
                                        <select disabled
                                                class="border-2 border-gray-100 w-full mb-4 shimmer-effect text-gray-400">
                                            <option>در حال بارگزاری</option>
                                        </select>
                                    {/if}
                                </div>
                                <div class="flex flex-col gap-2 text-sm">
                                    <label for="mselected_topic_title">موضوع</label>
                                    <textarea disabled={subject_on_modify.isAdmin}
                                              bind:value={subject_on_modify.title}
                                              id="mselected_topic_title"
                                              class="border-2 border-gray-100 py-2 px-2 rounded-sm"
                                              type="text" placeholder="موضوع شماره یک"></textarea>
                                </div>
                                <div class="flex flex-col gap-2 text-sm">
                                    <label for="mselected_topic_description">توضیحات</label>
                                    <textarea disabled={subject_on_modify.isAdmin}
                                              bind:value={subject_on_modify.description}
                                              id="mselected_topic_description"
                                              class="border-2 border-gray-100 py-2 px-2 rounded-sm"></textarea>
                                </div>
                            {/if}
                            <div class="flex flex-col gap-2 text-sm">
                                <label for="mselected_topic_comment">نقطه نظر</label>
                                <textarea bind:value={subject_on_modify.comment}
                                          id="mselected_topic_comment"
                                          class="border-2 border-gray-100 py-2 px-2 rounded-sm"></textarea>
                            </div>
                            <div class="flex flex-col gap-2 text-sm">
                                <div class="flex flex-row items-center">
                                    <label for="mselected_topic_progress">امتیاز/درصد پیشرفت</label>
                                    <span class="mr-auto">{subject_on_modify.progress}/100</span>
                                </div>
                                <input disabled={subject_on_modify.locked || subject_on_modify.progressLocked}
                                       type="range" bind:value={subject_on_modify.progress} min=0 max=100
                                       id="mselected_topic_progress" class="py-2"
                                       placeholder="موضوع شماره یک"/>
                            </div>
                            <div class="px-2 text-left pb-2">
                                {#if !subject_on_modify.locked}
                                    {#if !subject_on_modify.progressLocked}
                                        <button disabled={!is_modify_form_complete}
                                                on:click={() => modifySubject()}
                                                class="{is_modify_form_complete ? 'bg-blue-500':'bg-slate-500'} text-white py-2 {is_modify_form_complete ? 'hover:bg-blue-600':'hover:bg-slate-600'} rounded-sm mr-auto px-8">
                                            ثبت
                                        </button>
                                    {/if}
                                    {#if isAdmin}
                                        <button on:click={() => confirmSubject(subject_on_modify.id, subject_on_modify.unitId)}
                                                class="{is_modify_form_complete ? 'bg-blue-500':'bg-slate-500'} text-white py-2 {is_modify_form_complete ? 'hover:bg-blue-600':'hover:bg-slate-600'} rounded-sm mr-auto px-8">
                                            تایید
                                        </button>
                                    {/if}
                                {:else}
                                    {#if isAdmin}
                                        <button on:click={() => takeBackConfirmSubject(subject_on_modify.id, subject_on_modify.unitId)}
                                                class="{is_modify_form_complete ? 'bg-blue-500':'bg-slate-500'} text-white py-2 {is_modify_form_complete ? 'hover:bg-blue-600':'hover:bg-slate-600'} rounded-sm mr-auto px-8">
                                            بازگشت از تایید
                                        </button>
                                    {/if}
                                {/if}
                                <button on:click={() => {
                                    on_modify_subject = false;
                                }}
                                        class="bg-slate-500 text-white px-6 py-2 hover:bg-slate-600 rounded-sm">لغو
                                </button>
                            </div>
                        </div>
                    </div>
                {/if}
                {#if on_show_documents}
                    <div class="mb-8">
                        <div class="flex flex-col gap-2">
                            <div style="background-color: #3C8DBC"
                                 class="px-4 py-4 flex flex-row items-center text-white">
                                <h1 class="font-bold">بارگزاری/بارگیری اسناد</h1>
                            </div>
                            <!--{#if isAdmin}-->
                                {#if !selected_topic.locked}
                                    <div class="px-2 flex flex-col gap-2 text-sm">
                                        <label for="selected_topic_attachments"
                                               class="flex flex-row px-2 py-2 md:py-0 rounded-md bg-slate-50 text-black hover:bg-slate-100 text-black font-bold text-sm md:leading-10 outline-none text-center items-center cursor-pointer">
                                            <span>برای بارگزاری اسناد را انتخاب کنید</span>
                                            <i class="bi bi-cloud-upload text-xl flex mr-auto"></i>
                                        </label>
                                        <input
                                                accept=".csv, .xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheetapplication/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,
                                        text/plain, application/pdf, image/jpg, image/jpeg, image/png, application/zip"
                                                id="selected_topic_attachments" class="hidden" type="file" multiple
                                                bind:files={subject_on_show_documents.to_be_attached}/>
                                    </div>
                                    {#if subject_on_show_documents.to_be_attached && subject_on_show_documents.to_be_attached.length > 0}
                                        <div class="px-2 flex flex-col gap-2 text-sm">
                                            <span>اسناد انتخاب شده برای بارگزاری</span>
                                            <div class="flex flex-row flex-wrap gap-2 px-2">
                                                {#each Array.from(subject_on_show_documents.to_be_attached) as file}
                                                    <div class="shimmer-effect flex flex-row gap-2 bg-slate-50 rounded-lg text-sm items-center">
                                                        <i on:click={() => remove_attachment(file)}
                                                           class="hover:bg-slate-100 bi bi-x flex text-lg h-full items-center rounded-r-lg px-2 cursor-pointer"></i>
                                                        <span class="pl-2 py-2 text-gray-500">{file.name}</span>
                                                    </div>
                                                {/each}
                                            </div>
                                        </div>
                                    {/if}
                                {/if}
                            <!--{/if}-->
                            {#if subject_on_show_documents.attachments && subject_on_show_documents.attachments.length > 0}
                                <div data-sveltekit-preload-data="off"
                                     class="px-2 flex flex-col gap-2 text-sm">
                                    <span>اسناد بارگزاری شده</span>
                                    <div class="flex flex-row flex-wrap gap-2">
                                        {#each Array.from(subject_on_show_documents.attachments) as file}
                                            <div class="flex flex-row bg-slate-50 rounded-lg text-sm items-center">
                                                {#if !file.isAdmin}
                                                    <i on:click={removeDocument(file.id)}
                                                       class="bi bi-x flex text-lg h-full items-center rounded-r-lg px-2 cursor-pointer"></i>
                                                {/if}
                                                <a href="/api/subject/attachments?fileId={file.id}{get_file_extension(file.name)}"
                                                   class="shimmer-effect flex flex-row gap-2 items-center">
                                                    <i class="bi bi-cloud-download flex text-lg h-full items-center px-2 cursor-pointer"></i>
                                                    <span class="pl-2 py-2 text-gray-500">{file.name}</span>
                                                </a>
                                            </div>
                                        {/each}
                                    </div>
                                </div>
                            {/if}
                            <div class="px-2 mr-auto">
                                {#if subject_on_show_documents.to_be_attached.length > 0}
                                    <button disabled={on_upload}
                                            on:click={() => {
                                        uploadDoc()
                                    }}
                                            class="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-sm px-4">
                                        {on_upload ? 'درحال بارگزاری' : 'بارگزاری اسناد انتخاب شده'}
                                    </button>
                                {/if}
                                <button on:click={() => {
                                        on_show_documents = false;
                                    }}
                                        class="bg-slate-500 hover:bg-slate-600 text-white py-2 rounded-sm px-4">بستن
                                </button>
                            </div>
                        </div>
                    </div>
                {/if}
                {#if on_delete}
                    <div>
                        <div style="background-color: #3C8DBC"
                             class="px-4 py-4 flex flex-row items-center text-white">
                            <h1 class="font-bold">حذف عنوان</h1>
                        </div>
                        <hr/>
                        <div class="flex flex-col py-2 px-2 gap-2">
                            <div>
                                <span>شما در حال حذف این عنوان میباشید، آیا مطمئن هستید؟</span>
                            </div>
                            <div class="px-2 text-left pb-2">
                                <button on:click={() => removeSubject(subject_on_delete.id)}
                                        class="bg-blue-500 text-white py-2 hover:bg-blue-600 rounded-sm mr-auto px-8">
                                    بله
                                </button>
                                <button on:click={() => {
                                    on_delete = false;
                                }}
                                        class="bg-slate-500 text-white px-6 py-2 hover:bg-slate-600 rounded-sm">لغو
                                </button>
                            </div>
                        </div>
                    </div>
                {/if}
            </dialog>
        </div>
    {/if}
    <div class="px-2 py-2 text-gray-400 text-xs sm:text-md">
        <h1>مدیریت موضوعات</h1>
    </div>
    <div class="grid lg:grid-cols-2 gap-2 px-0 md:px-2 mb-16">
        <div class="bg-white h-min {selected_topic ? 'hidden md:block':''}">
            <div class="px-4 py-2 flex flex-col gap-2">
                <span>دوره های فعال</span>
                {#if selected_period}
                    <select class="border-2 border-gray-100 w-full mb-4"
                            bind:value={selected_period}>
                        {#each Array.from(periods) as period}
                            <option value="{period}" id="{period}">{period.title}</option>
                        {/each}
                    </select>
                {:else}
                    <select disabled
                            class="border-2 border-gray-100 w-full mb-4 shimmer-effect text-gray-400">
                        <option>در حال بارگزاری</option>
                    </select>
                {/if}
                {#if isAdmin}
                    <span>واحد فعال</span>
                    {#if units && selected_unit}
                        <select class="border-2 border-gray-100 w-full mb-4"
                                bind:value={selected_unit}>
                            {#each Array.from(units) as unit}
                                <option value="{unit}" id="{unit}">{unit.title}</option>
                            {/each}
                        </select>
                    {:else}
                        <select disabled
                                class="border-2 border-gray-100 w-full mb-4 shimmer-effect text-gray-400">
                            <option>در حال بارگزاری</option>
                        </select>
                    {/if}
                {/if}
                <h1 class="font-bold text-xs sm:text-md">موضوعات موجود در دوره</h1>
            </div>
            <hr/>
            <div class="flex flex-col py-2 px-2 gap-4">
                {#await topics}
                    <div class="flex flex-col gap-2">
                        <div class="shimmer-effect grow"><span class="py-4 text-lg invisible">abc</span></div>
                        <div class="shimmer-effect grow"><span class="py-4 text-lg invisible">abc</span></div>
                        <div class="shimmer-effect grow"><span class="py-4 text-lg invisible">abc</span></div>
                        <div class="shimmer-effect grow"><span class="py-4 text-lg invisible">abc</span></div>
                        <div class="shimmer-effect grow"><span class="py-4 text-lg invisible">abc</span></div>
                        <div class="shimmer-effect grow"><span class="py-4 text-lg invisible">abc</span></div>
                        <div class="shimmer-effect grow"><span class="py-4 text-lg invisible">abc</span></div>
                        <div class="shimmer-effect grow"><span class="py-4 text-lg invisible">abc</span></div>
                        <div class="shimmer-effect grow"><span class="py-4 text-lg invisible">abc</span></div>
                    </div>
                {:then result}
                    {#if result}
                        {#each Array.from(result) as topic}
                            <div on:click={async () => {
                                the_selected_topic.set(topic);
                                subject_on_create.topicId = topic.id;
                                subjects = await getTopicSubjects();
                            }}
                                 class="rounded-sm text-sm flex flex-col text-xs sm:text-md odd:bg-satcom-a even:bg-satcom-b">
                                <div in:fly="{{ y: -50, duration: 200 }}"
                                     class="flex flex-row cursor-pointer text-white relative">
                                    <div class="z-10 absolute left-2 -top-3 flex flex-row gap-2">
                                        <span style="direction: ltr"
                                              class="bg-yellow-counter font-bold text-[8px] sm:text-xs text-white px-2 py-[1px] rounded-lg">{topic.progress}
                                            امتیاز/درصد پیشرفت</span>
                                        <!--                                        <div class="font-bold text-[8px] bg-blue-200 text-blue-700 px-2 py-[1px] rounded-lg">-->
                                        <!--                                            3 عنوان اضافه شده-->
                                        <!--                                        </div>-->
                                    </div>
                                    <div class="flex flex-row items-center grow">
                                        <div on:click={() => {
                                         if (opened_topic !== undefined){
                                            opened_topic.is_opened = false;
                                            opened_topic.is_on_modify_topic = false;
                                            opened_topic = undefined;
                                        }
                                         topic.is_opened = false;
                                         topic.is_on_modify_topic = false;
                                    }} class="flex flex-row items-center grow py-2">
                                            <i class="text-lg bi {topic.locked ? 'bi-check-lg':'bi-file-text'} flex text-lg px-4 py-4"></i>
                                            <!--                                        <span class="text-xs sm:text-md text-justify leading-5">{topic.title.length > 50 ? `${topic.title.substring(0, 50)}...` : topic.title}</span>-->
                                            <span class="text-xs sm:text-lg text-justify leading-5">{topic.title}</span>
                                        </div>
                                        <!--{#if !topic.locked}-->
                                        <i on:click={()=> {

                                        topic_on_modify.id = topic.id;
                                        topic_on_modify.title = topic.title;
                                        topic_on_modify.progress = topic.progress;

                                        if (opened_topic !== undefined){
                                            opened_topic.is_on_modify_topic = false;
                                            opened_topic.is_opened = false;
                                            opened_topic = undefined;
                                        }
                                        topic.is_on_modify_topic = true;
                                        topic.is_opened = false;
                                        opened_topic = topic;
                                    }}
                                           class="text-lg bi bi-pencil h-full px-4 flex hover:bg-blue-300 mr-auto items-center"></i>
                                        <!--{/if}-->
                                        <i on:click={()=> {
                                        if (opened_topic !== undefined){
                                            opened_topic.is_opened = false;
                                            opened_topic.is_on_modify_topic = false;
                                            opened_topic = undefined;
                                        }
                                        topic.is_opened = true;
                                        topic.is_on_modify_topic = false;
                                        opened_topic = topic;
                                    }}
                                           class="text-lg bi bi-justify-right h-full flex px-4 hover:bg-blue-300 items-center"></i>
                                    </div>
                                </div>
                                {#if topic.is_on_modify_topic}
                                    <div class="flex flex-col gap-2 bg-slate-50 px-4 py-3">
                                        <div class="flex flex-col gap-2 text-sm">
                                            <div class="flex flex-row items-center">
                                                <label for="selected_topic_total_progress">امتیاز/درصد
                                                    پیشرفت {topic_on_modify.title}</label>
                                                <span class="mr-auto">{topic_on_modify.progress}/100</span>
                                            </div>
                                            <input disabled={topic.locked || topic.progressLocked}
                                                   type="range" bind:value={topic_on_modify.progress} min=0 max=100
                                                   id="selected_topic_total_progress" class="py-2"/>
                                        </div>
                                        <div class="flex flex-row-reverse gap-2">
                                            <button on:click={() => {
                                                topic.is_on_modify_topic = false;
                                            }}
                                                    class="py-2 px-3 rounded-sm bg-slate-200 text-slate-700 text-xs sm:text-md">
                                                لغو
                                            </button>
                                            {#if !topic.locked}
                                                {#if !topic.progressLocked}
                                                    <button on:click={() => submitTopicProgress()}
                                                            class="bg-blue-500 text-white px-3 py-2 hover:bg-blue-600 rounded-sm text-xs sm:text-md">
                                                        ثبت
                                                    </button>
                                                {/if}
                                                {#if isAdmin}
                                                    <button on:click={() => confirmTopic(topic.id, selected_unit.id)}
                                                            class="bg-blue-500 text-white px-3 py-2 hover:bg-blue-600 rounded-sm text-xs sm:text-md">
                                                        تایید
                                                    </button>
                                                {/if}
                                            {:else}
                                                {#if isAdmin}
                                                    <button on:click={() => takeBackConfirmTopic(topic.id, selected_unit.id)}
                                                            class="bg-blue-500 text-white px-3 py-2 hover:bg-blue-600 rounded-sm text-xs sm:text-md">
                                                        بازگشت از تایید
                                                    </button>
                                                {/if}
                                            {/if}

                                        </div>
                                    </div>
                                {/if}
                                {#if topic.is_opened}
                                    <div class="bg-slate-50 px-4 py-3 text-black text-justify leading-6 text-xs sm:text-md">
                                        <p>{topic.description}</p>
                                    </div>
                                {/if}
                            </div>
                        {/each}
                        {#if Array.from(result).length === 0}
                            <div class="flex flex-col gap-4 justify-center items-center h-full mt-8 mb-8">
                                <i class="bi bi-binoculars flex text-4xl"></i>
                                <span class="text-sm">در این دوره هیچ موضوعی یافت نشد</span>
                            </div>
                        {/if}
                    {:else}
                        <div class="flex flex-col gap-2">
                            <div class="shimmer-effect grow"><span class="py-4 text-lg invisible">abc</span></div>
                            <div class="shimmer-effect grow"><span class="py-4 text-lg invisible">abc</span></div>
                            <div class="shimmer-effect grow"><span class="py-4 text-lg invisible">abc</span></div>
                            <div class="shimmer-effect grow"><span class="py-4 text-lg invisible">abc</span></div>
                            <div class="shimmer-effect grow"><span class="py-4 text-lg invisible">abc</span></div>
                            <div class="shimmer-effect grow"><span class="py-4 text-lg invisible">abc</span></div>
                            <div class="shimmer-effect grow"><span class="py-4 text-lg invisible">abc</span></div>
                            <div class="shimmer-effect grow"><span class="py-4 text-lg invisible">abc</span></div>
                            <div class="shimmer-effect grow"><span class="py-4 text-lg invisible">abc</span></div>
                        </div>
                    {/if}
                {/await}
            </div>
        </div>
        <div class="bg-white h-min {selected_topic ? 'block':'hidden md:block'}">
            {#if selected_topic}
                <div class="px-2 py-2 flex flex-row items-center gap-2">
                    <h1 class="font-bold text-xs sm:text-md text-justify">عناوین ثبت شده در {selected_topic.title}</h1>
                    {#if !selected_topic.locked}
                        <button disabled={on_new_subject}
                                on:click={() => {
                            on_new_subject = !on_new_subject;
                            on_modify_subject = false;
                            getCategories();
                        }}
                                class="text-xs text-blue-700 bg-blue-200 hover:bg-blue-100 whitespace-nowrap px-2 py-2 rounded-sm mr-auto">
                            عنوان جدید
                        </button>
                    {/if}
                </div>
                <hr/>
                <div class="flex flex-col py-2 gap-2">
                    {#if grouped_items}
                        {#if _.isEmpty(grouped_items)}
                            <div class="flex flex-col gap-4 justify-center items-center h-full mt-8 mb-8">
                                <i class="bi bi-binoculars flex text-4xl"></i>
                                <span class="text-sm">هیچ موردی یافت نشد</span>
                            </div>
                        {:else}
                            {#each Object.keys(grouped_items) as subject_items}
                                <div style="background-color: #357CA5"
                                     class="px-6 py-3 flex flex-row text-white font-bold items-center">
                                    <span class="">{subject_items}</span>
                                    <span class="mr-auto text-xs">{grouped_items[subject_items].length} عنوان</span>
                                </div>
                                <div class="py-2 px-2 flex flex-col gap-4">
                                    {#if grouped_items[subject_items].length > 0}
                                        {#each grouped_items[subject_items] as subject_item}
                                            <div class="text-black {subject_item.isAdmin ? 'bg-satcom-b':'bg-self-subject'} cursor-pointer rounded-sm text-xs sm:text-md flex flex-col">
                                                <div class="flex flex-row grow relative">
                                                    {#if subject_item.progress > 0}
                                                        <div class="z-10 absolute left-2 -top-3 flex flex-row">
                                                        <span style="direction: ltr"
                                                              class="bg-yellow-counter font-bold text-[8px] sm:text-xs text-white px-2 py-[1px] rounded-lg">{subject_item.progress}
                                                            امتیاز/درصد پیشرفت</span>
                                                        </div>
                                                    {/if}
                                                    <div class="flex flex-row items-center grow">
                                                        <div class="flex flex-row items-center grow py-2">
                                                            <i class="bi {subject_item.locked ? 'bi-check-lg':'bi-file-text'} flex text-lg px-4 py-4 leading-6"></i>
                                                            <!--                                                        <span>{subject_item.title.length > 50 ? `${subject_item.title.substring(0, 50)}...` : subject_item.title}</span>-->
                                                            <span style="font-size: .8rem"
                                                                  class="text-justify leading-6">{subject_item.title}</span>
                                                        </div>
                                                        {#if !selected_topic.locked}
                                                            <i on:click={() => {
                                                                on_modify_subject = true;
                                                                on_new_subject = false;
                                                                subject_on_modify.id = subject_item.id;
                                                                subject_on_modify.topicId = subject_item.topicId;
                                                                subject_on_modify.unitId = subject_item.unitId;
                                                                subject_on_modify.personnelId = subject_item.personnelId;
                                                                subject_on_modify.title = subject_item.title;
                                                                subject_on_modify.description = subject_item.description;
                                                                subject_on_modify.progress = subject_item.progress;
                                                                subject_on_modify.category = subject_item.categoryId;
                                                                subject_on_modify.isAdmin = subject_item.isAdmin;
                                                                subject_on_modify.locked = subject_item.locked;
                                                                subject_on_modify.comment = subject_item.comment;
                                                                subject_on_modify.progressLocked = subject_item.progressLocked
                                                                getCategories();
                                                            }}
                                                               class="bi bi bi-pencil flex mr-auto text-lg px-4 h-full items-center hover:bg-blue-200"></i>

                                                            {#if !subject_item.isAdmin}
                                                                {#if !subject_item.locked}
                                                                    <i on:click={() => {
                                                                        on_delete = true;
                                                                        on_modify_subject = false;
                                                                        on_new_subject = false;
                                                                        subject_on_delete.id = subject_item.id;
                                                                    }}
                                                                       class="bi bi bi-trash flex text-lg px-4 h-full items-center hover:bg-blue-200"></i>
                                                                {/if}
                                                            {/if}
                                                        {/if}
                                                        <!--{#if subject_item.attachments}-->
                                                        <i on:click={() => {
                                                            on_new_subject = false;
                                                            on_modify_subject = false;
                                                            on_show_documents = true;
                                                            subject_on_show_documents.attachments = subject_item.attachments ? JSON.parse(subject_item.attachments): [];
                                                            subject_on_show_documents.id = subject_item.id;
                                                        }}
                                                           class="bi bi bi-cloud-download flex text-lg px-4 h-full items-center hover:bg-blue-200"></i>
                                                        <!--{/if}-->
                                                        <i on:click={()=> subject_item.is_opened = !subject_item.is_opened}
                                                           class="bi bi bi-justify-right flex text-lg px-4 h-full items-center hover:bg-blue-200"></i>
                                                    </div>
                                                </div>
                                                {#if subject_item.is_opened }
                                                    <div class="flex flex-col p-2 bg-slate-50">
                                                        <p class="text-gray-800 text-justify leading-6 text-xs">
                                                            {subject_item.description}
                                                        </p>
                                                    </div>
                                                {/if}
                                            </div>
                                        {/each}
                                    {:else}
                                        <div class="flex flex-col gap-4 justify-center items-center h-full mt-8 mb-8">
                                            <i class="bi bi-binoculars flex text-4xl"></i>
                                            <span class="text-sm">در این موضوع هیچ عنوانی ثبت نشده است</span>
                                        </div>
                                    {/if}
                                </div>
                            {/each}
                        {/if}
                    {/if}
                </div>
            {:else}
                <div class="flex flex-col gap-4 justify-center items-center h-full mt-8 mb-8">
                    <i class="bi bi-binoculars flex text-4xl"></i>
                    <span class="text-sm">ابتدا یک موضوع انتخاب کنید</span>
                </div>
            {/if}
        </div>

    </div>
    {#if selected_topic}
        <div style="background-color: #357CA5"
             on:click={() => the_selected_topic.set(undefined)}
             class="block md:hidden text-white text-center py-3 fixed bottom-0 left-0 w-full z-10">
            <span>بازگشت</span>
        </div>
    {/if}

</div>

<style>
    @keyframes placeHolderShimmer {
        0% {
            background-position: -468px 0
        }
        100% {
            background-position: 468px 0
        }
    }

    .shimmer-effect {
        animation-duration: 1.25s;
        animation-fill-mode: forwards;
        animation-iteration-count: infinite;
        animation-name: placeHolderShimmer;
        animation-timing-function: linear;
        background: #F6F6F6;
        background: linear-gradient(to right, #F6F6F6 8%, #F0F0F0 18%, #F6F6F6 33%);
        background-size: 800px 104px;
        position: relative;
    }

    ::backdrop {
        --color-backdrop: red;
    }

    .dialog-box::backdrop {
        background: var(--color-backdrop);
    }
</style>
