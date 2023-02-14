<script>

    import {END_POINT} from "../../../constants.js";
    import {onMount} from "svelte";

    let subject_on_create = {
        title: '',
        description: '',
        period: '',
        topicId: '',
        category: '',
        units: []
    };

    let subject_on_modify = {
        id: '',
        description: '',
        period: '',
        topicId: '',
        category: '',
        units: []
    };

    let subject_on_upload = {
        id: '',
        preAttached: [],
        attachments: []
    }

    let on_new_subject = false;

    let on_modify_subject = false;

    let on_upload_doc = false;

    async function getSubjects() {
        const req = await fetch(`${END_POINT}/api/subject/get_subjects`);
        try {
            const resj = await req.json();
            const res = JSON.parse(resj);

            if (req.ok) {
                return res;
            } else {
            }
        } catch (e) {

        }
    }

    let subjects;

    async function getPeriods() {
        const req = await fetch(`${END_POINT}/api/period/get_periods`)
        const res = await req.json();

        if (req.ok) {
            console.log(res);
            return res;
        } else {
        }
    }

    let units;

    async function getUnits() {
        const req = await fetch(`${END_POINT}/api/unit/get_units`)
        const res = await req.json();

        if (req.ok) {
            console.log(res);
            return res;
        } else {
        }
    }

    function getUnitTitle(unitdata, unitId) {
        console.log('unist');
        console.log(units);
        console.log('end of unist')
        if (unitdata) {
            console.log('units');
            for (let i = 0; i < unitdata.length; i++) {
                console.log(unitdata[i]);
                if (unitdata[i].id === unitId) {
                    console.log(unitdata[i]);
                    return unitdata[i].title;
                }
            }
        }
        return unitId;
    }

    let periods;

    onMount(async () => {
        subjects = getSubjects();
        periods = await getPeriods();
        units = await getUnits();
        if (periods.length > 0) {
            selected_period = periods[0];
            subject_on_create.period = selected_period.id;
            subject_on_modify.period = selected_period.id;
            await getPeriodTopics();
        }

    });

    async function createSubject() {
        console.log(JSON.stringify(subject_on_create));

        const form_body = new FormData();
        form_body.append('title', subject_on_create.title);
        form_body.append('description', subject_on_create.description);
        form_body.append('personnelId', '299212');
        form_body.append('topicId', subject_on_create.topicId);
        form_body.append('weight', 0);
        form_body.append('normalWeight', 0);
        form_body.append('category', subject_on_create.category);
        form_body.append('units', subject_on_create.units);

        console.log('ready to submit');
        console.log(subject_on_create);

        const req = await fetch(`${END_POINT}/api/subject/create_topic_subject`, {
            method: 'POST',
            body: form_body
        })
        const res = await req.json();

        if (req.ok) {
            subjects = getSubjects();
        } else {
        }

        subject_on_create = {
            title: '',
            description: '',
            period: subject_on_create.period,
            topicId: subject_on_create.topicId,
            category: subject_on_create.category,
            units: []
        };
        on_new_subject = false;
    }

    let on_upload = false;

    async function uploadSubjectDocs() {
        on_upload = true;
        console.log(JSON.stringify(subject_on_upload));

        const form_body = new FormData();
        form_body.append('id', subject_on_upload.id);

        if (subject_on_upload.attachments !== undefined) {
            let all_attachments = Array.from(subject_on_upload.attachments);
            for (let i = 0; i < all_attachments.length; i++) {
                form_body.append('attachments', all_attachments[i]);
            }
        }

        console.log('ready to submit');
        console.log(subject_on_upload);

        const req = await fetch(`${END_POINT}/api/subject/upload_docs`, {
            method: 'POST',
            body: form_body
        })
        const res = await req.json();

        if (req.ok) {
            subjects = getSubjects();
            subject_on_upload = {
                id: '',
                attachments: []
            };
            on_upload = false;
            on_upload_doc = false;
        } else {
        }
    }

    async function modifySubject() {

        const form_body = new FormData();
        form_body.append('subjectId', subject_on_modify.id);
        form_body.append('topicId', subject_on_modify.topicId);
        form_body.append('title', subject_on_modify.title);
        form_body.append('description', subject_on_modify.description);
        form_body.append('weight', 0);
        form_body.append('normalWeight', 0);
        form_body.append('category', subject_on_modify.category);

        const req = await fetch(`${END_POINT}/api/subject/update_topic_subject`, {
            method: 'POST',
            body: form_body
        })
        const res = await req.json();

        if (req.ok) {
            subjects = getSubjects();
        } else {
        }

        subject_on_modify = {
            title: '',
            description: '',
            active: true
        };

        on_modify_subject = false;
    }


    function getPeriodId(title) {
        for (let i = 0; i < periods.length; i++) {
            if (periods[i].title === title)
                return periods[i].id;
        }
        return -1;
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
            console.log(res);
            subjects = await getSubjects();
            console.log(subjects);
            // if (requests.length < 10)
            //     show_more_visible = false;
        } else {
            // show_more_visible = false;
        }
    }

    async function inactivateSubject(id) {

        const form_body = new FormData();
        form_body.append('topicId', id);

        const req = await fetch(`${END_POINT}/api/topic/set_inactive`, {
            method: 'POST',
            body: form_body
        })
        const res = await req.json();

        if (req.ok) {
            console.log(res);
            subjects = getSubjects();
        } else {
        }
    }

    async function activateSubject(id) {

        const form_body = new FormData();
        form_body.append('topicId', id);

        const req = await fetch(`${END_POINT}/api/topic/set_active`, {
            method: 'POST',
            body: form_body
        })
        const res = await req.json();

        if (req.ok) {
            subjects = getSubjects();
        } else {
        }
    }

    let is_create_form_complete = false;

    $: {
        is_create_form_complete =
            subject_on_create
            && subject_on_create.title
            && subject_on_create.description
            && subject_on_create.period
            && subject_on_create.topicId
            && subject_on_create.category
            && subject_on_create.units
            && subject_on_create.title.length > 0
            && subject_on_create.description.length > 0
            && subject_on_create.period.length > 0
            && subject_on_create.topicId.length > 0
            && subject_on_create.category.length > 0
            && subject_on_create.units.length > 0;
    }

    let is_modify_form_complete = false;

    $: {
        is_modify_form_complete =
            subject_on_modify
            && subject_on_modify.title
            && subject_on_modify.description
            && subject_on_modify.period
            && subject_on_modify.topicId
            && subject_on_modify.category
            && subject_on_modify.title.length > 0
            && subject_on_modify.description.length > 0
            && subject_on_modify.period.length > 0
            && subject_on_modify.topicId.length > 0
            && subject_on_modify.category.length > 0;

        console.log(is_modify_form_complete);
    }

    let selected_period;

    let topics;

    async function getPeriodTopics() {
        console.log('main function called up');

        const req = await fetch(`${END_POINT}/api/topic/get_period_topics?periodId=${subject_on_create.period}`)
        const res = await req.json();

        if (req.ok) {
            topics = res;
            if (topics.length > 0) {
                subject_on_create.topicId = topics[0].id;
                subject_on_modify.topicId = topics[0].id;
                console.log('these are the topics');
                console.log(topics);
                await getTopicCategories();
            }
        } else {
        }
    }

    async function modifyGetPeriodTopics() {
        console.log('main function called up');

        const req = await fetch(`${END_POINT}/api/topic/get_period_topics?periodId=${subject_on_modify.period}`)
        const res = await req.json();

        if (req.ok) {
            topics = res;
            if (topics.length > 0) {
                subject_on_create.topicId = topics[0].id;
                await getTopicCategories();
            }
        } else {
        }
    }

    let categories;

    async function getTopicCategories() {
        console.log('trigger');
        console.log(subject_on_create.topicId);
        const req = await fetch(`${END_POINT}/api/topic/get_topic_categories?topicId=${subject_on_create.topicId}`)
        const res = await req.json();

        if (req.ok) {
            categories = res;
            if (categories.length > 0) {
                subject_on_create.category = categories[0].id;
                subject_on_modify.category = categories[0].id;
            }
        } else {
        }
    }

    async function modifyGetTopicCategories() {
        console.log('trigger');
        console.log(subject_on_create.topicId);
        const req = await fetch(`${END_POINT}/api/topic/get_topic_categories?topicId=${subject_on_create.topicId}`)
        const res = await req.json();

        if (req.ok) {
            categories = res;
            if (categories.length > 0) {
                subject_on_create.category = categories[0].id;
            }
        } else {
        }
    }

    import {fly, fade} from 'svelte/transition';


</script>

<div class="">
    {#if on_new_subject || on_modify_subject || on_upload_doc}
        <div class="bg-black/60 backdrop-opacity-50 w-screen h-screen fixed top-0 right-0 z-20">
            <dialog in:fly="{{ y: -100, duration: 200 }}" out:fly="{{ y: -100, duration: 200 }}"
                    class="z-20 w-full md:w-3/5 drop-shadow-xl top-32 p-0 dialog-box"
                    open="{on_new_subject || on_modify_subject || on_upload_doc ? 'open':''}">
                {#if on_new_subject}
                    <div class="mb-8">
                        <div class="flex flex-col gap-2">
                            <div class="px-4 py-4 flex flex-row items-center bg-blue-600 text-white">
                                <h1 class="font-bold">ثبت عنوان جدید در این موضوع</h1>
                            </div>
                            <div class="px-2 flex flex-col gap-2 text-sm">
                                <label for="selected_topic_title">عنوان</label>
                                <input bind:value={subject_on_create.title}
                                       id="selected_topic_title"
                                       class="border-2 border-gray-100 py-2 px-2 rounded-sm"
                                       type="text" placeholder="عنوان"/>
                            </div>
                            <div class="px-2 flex flex-col gap-2 text-sm grow">
                                <label for="selected_topic_description">توضیحات</label>
                                <textarea bind:value={subject_on_create.description}
                                          id="selected_topic_description"
                                          class="border-2 border-gray-100 py-2 px-2 rounded-sm"
                                          type="text" placeholder="توضیحات"></textarea>
                            </div>
                            <div class="px-2 flex flex-col gap-2 text-sm grow">
                                <label for="selected_period">دوره ی فعال</label>
                                <select class="border-2 border-gray-100"
                                        id="selected_period" bind:value={subject_on_create.period}
                                        on:change={() => getPeriodTopics()}>
                                    {#if periods}
                                        {#each periods as period}
                                            <option value="{period.id}">{period.title}</option>
                                        {/each}
                                    {/if}
                                </select>
                            </div>
                            <div class="px-2 flex flex-col gap-2 text-sm grow">
                                <label for="selected_topic">موضوع فعال</label>
                                <select class="border-2 border-gray-100"
                                        id="selected_topic" bind:value={subject_on_create.topicId}
                                        on:change={() => getTopicCategories()}>
                                    {#if topics}
                                        {#each topics as topic}
                                            <option value="{topic.id}">{topic.title}</option>
                                        {/each}
                                    {/if}
                                </select>
                            </div>
                            <div class="px-2 flex flex-col gap-2 text-sm grow">
                                <label for="selected_topic_category">گروه فعال</label>
                                <select class="border-2 border-gray-100"
                                        id="selected_topic_category" bind:value={subject_on_create.category}>
                                    {#if categories}
                                        {#each categories as category}
                                            <option value="{category.id}">{category.name}</option>
                                        {/each}
                                    {/if}
                                </select>
                            </div>
                            <div class="px-2 flex flex-col gap-2 text-sm grow">
                                <label for="selected_unit">واحد های فعال</label>
                                <select class="chosen-select border-2 border-gray-100"
                                        id="selected_unit" multiple bind:value={subject_on_create.units}>
                                    {#if units}
                                        {#each units as unit}
                                            <option value="{unit.id}">{unit.title}</option>
                                        {/each}
                                    {/if}
                                </select>
                            </div>
                            <div class="px-2 mr-auto">
                                <button disabled={!is_create_form_complete}
                                        on:click={() => createSubject()}
                                        class="{is_create_form_complete ? 'bg-blue-500':'bg-slate-500'} text-white py-2 {is_create_form_complete ? 'hover:bg-blue-600':'hover:bg-slate-600'} rounded-sm mr-auto px-8">
                                    ثبت
                                </button>
                                <button on:click={() => {
                                on_new_subject = false;
                                subject_on_create = {
                                    title: '',
                                    description: '',
                                    period: subject_on_create.period,
                                    topicId: subject_on_create.topicId,
                                    category: subject_on_create.category,
                                    units: []
                                };
                            }}
                                        class="bg-slate-500 hover:bg-slate-600 text-white py-2 rounded-sm px-4">لغو
                                </button>
                            </div>
                        </div>
                    </div>
                {/if}
                {#if on_modify_subject}
                    <div class="mb-8">
                        <div class="px-4 py-4 flex flex-row items-center bg-blue-600 text-white">
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
                            <div class="px-2 flex flex-col gap-2 text-sm">
                                <label for="mselected_topic_title">عنوان</label>
                                <input bind:value={subject_on_modify.title}
                                       id="mselected_topic_title"
                                       class="border-2 border-gray-100 py-2 px-2 rounded-sm"
                                       type="text" placeholder="عنوان موضوع"/>
                            </div>
                            <div class="px-2 flex flex-col gap-2 text-sm grow">
                                <label for="mselected_topic_description">توضیحات موضوع</label>
                                <textarea bind:value={subject_on_modify.description}
                                          id="mselected_topic_description"
                                          class="border-2 border-gray-100 py-2 px-2 rounded-sm"
                                          type="text" placeholder="توضیحات"></textarea>
                            </div>
                            <div class="px-2 flex flex-col gap-2 text-sm grow">
                                <label for="mselected_period">دوره ی فعال</label>
                                <select class="border-2 border-gray-100"
                                        id="mselected_period" bind:value={subject_on_modify.period}
                                        on:change={()=> modifyGetPeriodTopics()}>
                                    {#if periods}
                                        {#each periods as period}
                                            <option value="{period.id}">{period.title}</option>
                                        {/each}
                                    {/if}
                                </select>
                            </div>
                            <div class="px-2 flex flex-col gap-2 text-sm grow">
                                <label for="mselected_topic">موضوع فعال</label>
                                <select class="border-2 border-gray-100"
                                        id="mselected_topic" bind:value={subject_on_modify.topicId}
                                        on:change={() => modifyGetTopicCategories()}>
                                    {#if topics}
                                        {#each topics as topic}
                                            <option value="{topic.id}">{topic.title}</option>
                                        {/each}
                                    {/if}
                                </select>
                            </div>
                            <div class="px-2 flex flex-col gap-2 text-sm grow">
                                <label for="mselected_topic_category">گروه فعال</label>
                                <select class="border-2 border-gray-100"
                                        id="mselected_topic_category" bind:value={subject_on_modify.category}>
                                    {#if categories}
                                        {#each categories as category}
                                            <option value="{category.id}">{category.name}</option>
                                        {/each}
                                    {/if}
                                </select>
                            </div>
                            <!--                        <div class="px-2 flex flex-col gap-2 text-sm grow">-->
                            <!--                            <label for="mselected_unit">واحد های فعال</label>-->
                            <!--                            <select class="chosen-select border-2 border-gray-100"-->
                            <!--                                    id="mselected_unit" multiple bind:value={subject_on_modify.units}>-->
                            <!--                                {#if units}-->
                            <!--                                    {#each units as unit}-->
                            <!--                                        <option value="{unit.id}">{unit.title}</option>-->
                            <!--                                    {/each}-->
                            <!--                                {/if}-->
                            <!--                            </select>-->
                            <!--                        </div>-->
                            <div class="px-2 mr-auto">
                                <button disabled={!is_modify_form_complete}
                                        on:click={() => modifySubject(subject_on_modify.id)}
                                        class="{is_modify_form_complete ? 'bg-blue-500':'bg-slate-500'} text-white py-2 {is_modify_form_complete ? 'hover:bg-blue-600':'hover:bg-slate-600'} rounded-sm mr-auto px-8">
                                    ثبت
                                </button>
                                <button on:click={() => {
                                on_modify_subject = false;
                            }}
                                        class="bg-slate-500 hover:bg-slate-600 text-white py-2 rounded-sm px-4">لغو
                                </button>
                            </div>
                        </div>
                        <hr/>
                    </div>
                {/if}
                {#if on_upload_doc}
                    <div class="mb-8">
                        <div class="flex flex-col gap-2">
                            <div class="px-4 py-4 flex flex-row items-center bg-blue-600 text-white">
                                <h1 class="font-bold">بارگزاری اسناد</h1>
                            </div>
                            <div class="px-2 flex flex-col gap-2 text-sm">
                                <label for="selected_topic_attachments"
                                       class="flex flex-row px-2 py-2 md:py-0 rounded-md bg-slate-50 text-black hover:bg-slate-100 text-black font-bold text-sm md:leading-10 outline-none text-center items-center cursor-pointer">
                                    <span>برای بارگزاری اسناد را انتخاب کنید</span>
                                    <i class="bi bi-cloud-upload text-xl flex mr-auto"></i>
                                </label>
                                <input
                                        accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint,
                                        text/plain, application/pdf, image/jpg, image/jpeg, image/png, application/zip"
                                        id="selected_topic_attachments" class="hidden" type="file" multiple
                                        bind:files={subject_on_upload.attachments}/>
                            </div>
                            {#if subject_on_upload.preAttached}
                                <div class="px-2 flex flex-col gap-2 text-sm">
                                    <span>اسناد بارگزاری شده</span>
                                    <div class="flex flex-row flex-wrap gap-2">
                                        {#each Array.from(subject_on_upload.preAttached) as file}
                                            <a href="/api/subject/attachments?fileId={file.id}{file.name}"
                                               class="shimmer-effect flex flex-row gap-2 bg-slate-50 rounded-lg text-sm items-center">
                                                <i class="bi bi-cloud-download flex text-lg h-full items-center rounded-r-lg px-2 cursor-pointer"></i>
                                                <span class="pl-2 py-2 text-gray-500">{file.name}</span>
                                            </a>
                                        {/each}
                                    </div>
                                </div>
                            {/if}
                            {#if subject_on_upload.attachments && subject_on_upload.attachments.length > 0}
                                <div class="px-2 flex flex-col gap-2 text-sm">
                                    <span>اسناد انتخاب شده برای بارگزاری</span>
                                    <div class="flex flex-row flex-wrap gap-2 px-2">
                                        {#each Array.from(subject_on_upload.attachments) as file}
                                            <div class="shimmer-effect flex flex-row gap-2 bg-slate-50 rounded-lg text-sm items-center">
                                                <i on:click={() => console.log(file)}
                                                   class="hover:bg-slate-100 bi bi-x flex text-lg h-full items-center rounded-r-lg px-2 cursor-pointer"></i>
                                                <span class="pl-2 py-2 text-gray-500">{file.name}</span>
                                            </div>
                                        {/each}
                                    </div>
                                </div>
                            {/if}
                            <div class="px-2 mr-auto">
                                <button disabled={subject_on_upload.attachments.length === 0}
                                        on:click={() => uploadSubjectDocs()}
                                        class="{subject_on_upload.attachments.length > 0 ? 'bg-blue-500':'bg-slate-500'} text-white py-2 {subject_on_upload.attachments.length > 0 ? 'hover:bg-blue-600':'hover:bg-slate-600'} rounded-sm mr-auto px-8">
                                    ثبت
                                </button>
                                <button on:click={() => {
                                on_upload_doc = false;
                            }}
                                        class="bg-slate-500 hover:bg-slate-600 text-white py-2 rounded-sm px-4">لغو
                                </button>
                            </div>
                        </div>
                    </div>
                {/if}
            </dialog>
        </div>
    {/if}
    <div class="px-2 py-2 text-gray-400 text-xs sm:text-md">
        <h1>پیمایش عناوین</h1>
    </div>
    <div class="gap-2 md:px-2">
        <div class="bg-white">
            <!--{#if on_new_subject}-->
            <!--    <div class="mb-8">-->
            <!--        <div class="flex flex-col py-2 px-2 gap-2">-->
            <!--            <div class="px-2 flex flex-row items-center">-->
            <!--                <h1 class="font-bold">اضافه کردن یک عنوان جدید</h1>-->
            <!--                {#if on_new_subject}-->
            <!--                    <i on:click={() => {-->
            <!--                        on_new_subject = !on_new_subject;-->
            <!--                    }}-->
            <!--                       class="bi bi-dash-square flex text-xl text-red-500 hover:text-red-700 cursor-pointer mr-auto"></i>-->
            <!--                {/if}-->
            <!--            </div>-->
            <!--            <hr/>-->
            <!--            <div class="px-2 flex flex-col gap-2 text-sm">-->
            <!--                <label for="selected_topic_title">عنوان</label>-->
            <!--                <input bind:value={subject_on_create.title}-->
            <!--                       id="selected_topic_title"-->
            <!--                       class="border-2 border-gray-100 py-2 px-2 rounded-sm"-->
            <!--                       type="text" placeholder="عنوان"/>-->
            <!--            </div>-->
            <!--            <div class="px-2 flex flex-col gap-2 text-sm grow">-->
            <!--                <label for="selected_topic_description">توضیحات</label>-->
            <!--                <textarea bind:value={subject_on_create.description}-->
            <!--                          id="selected_topic_description"-->
            <!--                          class="border-2 border-gray-100 py-2 px-2 rounded-sm"-->
            <!--                          type="text" placeholder="توضیحات"></textarea>-->
            <!--            </div>-->
            <!--            <div class="px-2 flex flex-col gap-2 text-sm grow">-->
            <!--                <label for="selected_period">دوره ی فعال</label>-->
            <!--                <select class="border-2 border-gray-100"-->
            <!--                        id="selected_period" bind:value={subject_on_create.period}-->
            <!--                        on:change={()=> getPeriodTopics()}>-->
            <!--                    {#if periods}-->
            <!--                        {#each periods as period}-->
            <!--                            <option value="{period.id}">{period.title}</option>-->
            <!--                        {/each}-->
            <!--                    {/if}-->
            <!--                </select>-->
            <!--            </div>-->
            <!--            <div class="px-2 flex flex-col gap-2 text-sm grow">-->
            <!--                <label for="selected_topic">موضوع فعال</label>-->
            <!--                <select class="border-2 border-gray-100"-->
            <!--                        id="selected_topic" bind:value={subject_on_create.topicId}-->
            <!--                        on:change={() => getTopicCategories()}>-->
            <!--                    {#if topics}-->
            <!--                        {#each topics as topic}-->
            <!--                            <option value="{topic.id}">{topic.title}</option>-->
            <!--                        {/each}-->
            <!--                    {/if}-->
            <!--                </select>-->
            <!--            </div>-->
            <!--            <div class="px-2 flex flex-col gap-2 text-sm grow">-->
            <!--                <label for="selected_topic_category">گروه فعال</label>-->
            <!--                <select class="border-2 border-gray-100"-->
            <!--                        id="selected_topic_category" bind:value={subject_on_create.category}>-->
            <!--                    {#if categories}-->
            <!--                        {#each categories as category}-->
            <!--                            <option value="{category.id}">{category.name}</option>-->
            <!--                        {/each}-->
            <!--                    {/if}-->
            <!--                </select>-->
            <!--            </div>-->
            <!--            <div class="px-2 flex flex-col gap-2 text-sm grow">-->
            <!--                <label for="selected_unit">واحد های فعال</label>-->
            <!--                <select class="chosen-select border-2 border-gray-100"-->
            <!--                        id="selected_unit" multiple bind:value={subject_on_create.units}>-->
            <!--                    {#if units}-->
            <!--                        {#each units as unit}-->
            <!--                            <option value="{unit.id}">{unit.title}</option>-->
            <!--                        {/each}-->
            <!--                    {/if}-->
            <!--                </select>-->
            <!--            </div>-->
            <!--            <div class="px-2 mr-auto">-->
            <!--                <button disabled={!is_create_form_complete}-->
            <!--                        on:click={() => createSubject()}-->
            <!--                        class="{is_create_form_complete ? 'bg-blue-500':'bg-slate-500'} text-white py-2 {is_create_form_complete ? 'hover:bg-blue-600':'hover:bg-slate-600'} rounded-sm mr-auto px-8">-->
            <!--                    ثبت-->
            <!--                </button>-->
            <!--                <button on:click={() => {-->
            <!--                    on_new_subject = false;-->
            <!--                }}-->
            <!--                        class="bg-slate-500 hover:bg-slate-600 text-white py-2 rounded-sm px-4">لغو-->
            <!--                </button>-->
            <!--            </div>-->
            <!--        </div>-->
            <!--        <hr/>-->
            <!--    </div>-->
            <!--{/if}-->
            <!--{#if on_modify_subject}-->
            <!--    <div class="mb-8">-->
            <!--        <div class="px-4 py-2 flex flex-row items-center">-->
            <!--            <h1 class="font-bold">ویرایش عنوان انتخاب شده</h1>-->
            <!--            {#if on_new_subject}-->
            <!--                <i on:click={() => {-->
            <!--                        on_new_subject = !on_new_subject;-->
            <!--                    }}-->
            <!--                   class="bi bi-dash-square flex text-xl text-red-500 hover:text-red-700 cursor-pointer mr-auto"></i>-->
            <!--            {/if}-->
            <!--        </div>-->
            <!--        <hr/>-->
            <!--        <div class="flex flex-col py-2 px-2 gap-2">-->
            <!--            <div class="px-2 flex flex-col gap-2 text-sm">-->
            <!--                <label for="mselected_topic_title">عنوان</label>-->
            <!--                <input bind:value={subject_on_modify.title}-->
            <!--                       id="mselected_topic_title"-->
            <!--                       class="border-2 border-gray-100 py-2 px-2 rounded-sm"-->
            <!--                       type="text" placeholder="عنوان موضوع"/>-->
            <!--            </div>-->
            <!--            <div class="px-2 flex flex-col gap-2 text-sm grow">-->
            <!--                <label for="mselected_topic_description">توضیحات موضوع</label>-->
            <!--                <textarea bind:value={subject_on_modify.description}-->
            <!--                          id="mselected_topic_description"-->
            <!--                          class="border-2 border-gray-100 py-2 px-2 rounded-sm"-->
            <!--                          type="text" placeholder="توضیحات"></textarea>-->
            <!--            </div>-->
            <!--            <div class="px-2 flex flex-col gap-2 text-sm grow">-->
            <!--                <label for="mselected_topic_period">دوره ی فعال</label>-->
            <!--                <select class="border-2 border-gray-100"-->
            <!--                        id="mselected_topic_period" bind:value={subject_on_modify.period}>-->
            <!--                    {#if periods}-->
            <!--                        {#each periods as period}-->
            <!--                            <option value="{period.id}">{period.title}</option>-->
            <!--                        {/each}-->
            <!--                    {/if}-->
            <!--                </select>-->
            <!--            </div>-->
            <!--            <div class="px-2 mr-auto">-->
            <!--                <button disabled={!is_modify_form_complete}-->
            <!--                        on:click={() => modifySubject(subject_on_modify.id)}-->
            <!--                        class="{is_modify_form_complete ? 'bg-blue-500':'bg-slate-500'} text-white py-2 {is_modify_form_complete ? 'hover:bg-blue-600':'hover:bg-slate-600'} rounded-sm mr-auto px-8">-->
            <!--                    ثبت-->
            <!--                </button>-->
            <!--                <button on:click={() => {-->
            <!--                    on_modify_subject = false;-->
            <!--                }}-->
            <!--                        class="bg-slate-500 hover:bg-slate-600 text-white py-2 rounded-sm px-4">لغو-->
            <!--                </button>-->
            <!--            </div>-->
            <!--        </div>-->
            <!--        <hr/>-->
            <!--    </div>-->
            <!--{/if}-->
            <div class="px-4 py-2 flex">
                <h1 class="font-bold text-xs sm:text-md">همه ی عناوین ثبت شده</h1>
                {#if !on_new_subject}
                    <i on:click={() => {
                    on_new_subject = !on_new_subject;
                    on_modify_subject = false;
                        }}
                       class="bi bi-plus-square flex mr-auto text-xl text-blue-500 cursor-pointer hover:text-blue-700"></i>
                {/if}
            </div>
            <div class="md:p-2 overflow-auto">
                <table role="gridcell"
                       class="w-full text-sm text-left text-gray-500 mb-8">
                    <thead class="text-xsm md:text-md text-center text-gray-700 uppercase bg-gray-100">
                    <tr class="">
                        <th scope="col" class="py-3 px-6 whitespace-nowrap">
                            عنوان
                        </th>
                        <th scope="col" class="py-3 px-6 whitespace-nowrap">
                            توضیحات
                        </th>
                        <th scope="col" class="py-3 px-6 whitespace-nowrap">
                            دوره ی فعال
                        </th>
                        <th scope="col" class="py-3 px-6 whitespace-nowrap">
                            موضوع فعال
                        </th>
                        <th scope="col" class="py-3 px-6 whitespace-nowrap">
                            گروه فعال
                        </th>
                        <th scope="col" class="py-3 px-6 whitespace-nowrap">
                            واحد های فعال
                        </th>
                        <th scope="col" class="py-3 px-6 whitespace-nowrap">
                            عملیات
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {#await subjects}

                    {:then result}
                        {#if result}
                            {#each Array.from(result) as subject}
                                <tr
                                        class="hover:cursor-pointer even:bg-gray-50 text-center bg-white hover:bg-gray-50 ">
                                    <td scope="row"
                                        class="py-6 px-6 font-medium text-gray-900 ">
                                        <!--{subject.title.length > 30 ? `${subject.title.substring(0, 30)}...` : subject.title}-->
                                        {subject.title}
                                    </td>
                                    <td class="py-6 px-6 flex justify-center">
                                        <!--{subject.description.length > 30 ? `${subject.description.substring(0, 30)}...` : subject.description}-->
                                        {subject.description}
                                    </td>
                                    <td class="py-6 px-6">
                                        <!--{subject.periodTitle.length > 30 ? `${subject.periodTitle.substring(0, 30)}...` : subject.periodTitle}-->
                                        {subject.periodTitle}
                                    </td>
                                    <td class="py-6 px-6">
                                        <!--{subject.topicTitle.length > 30 ? `${subject.topicTitle.substring(0, 30)}...` : subject.topicTitle}-->
                                        {subject.topicTitle}
                                    </td>
                                    <td class="py-6 px-6">
                                        <!--{subject.category.length > 30 ? `${subject.category.substring(0, 30)}...` : subject.category}-->
                                        {subject.category}
                                    </td>
                                    <td class="py-6 px-6">
                                        <div style="direction: ltr">
                                            <!--{subject.units.length > 3 ? subject.units.map(u => u.unitId).join(', ') + ',...' : subject.units.map(u => u.unitId).join(', ')}-->
                                            {#await units}
                                                درحال بارگزاری
                                            {:then unitdata}
                                                {subject.units.map(u => getUnitTitle(unitdata, u.unitId)).join(', ')}
                                            {/await}
                                        </div>
                                        <!--                                        <div>-->
                                        <!--{#each subject.units as unit}-->
                                        <!--    <span>{unit.unitId}</span>-->
                                        <!--{/each}-->
                                        <!--                                        </div>-->

                                    </td>
                                    <td class="py-6 px-6 whitespace-nowrap">
                                        <div class="flex flex-row gap-2 items-center justify-center text-md">
                                            <i on:click={() => {
                                                on_modify_subject = true;
                                                on_upload_doc = false;
                                                on_new_subject = false;
                                                subject_on_modify.id = subject.id;
                                                subject_on_modify.title = subject.title;
                                                subject_on_modify.description = subject.description;
                                                subject_on_modify.period = subject.periodId;
                                                subject_on_modify.topicId = subject.topicId;
                                                subject_on_modify.category = subject.categoryId;
                                                subject_on_modify.units = subject.units.map(u => u.unitId);
                                                modifyGetPeriodTopics();
                                            }}
                                               class="bi bi-pencil-square flex bg-yellow-600 text-white p-[3px] rounded-sm"></i>

                                            <i on:click={() => {
                                                on_modify_subject = false;
                                                on_new_subject = false;
                                                on_upload_doc = true;
                                                subject_on_upload.id = subject.id;
                                                subject_on_upload.preAttached = subject.attachments;
                                            }}
                                               class="bi bi-cloud-upload flex bg-blue-500 text-white p-[3px] rounded-sm"></i>

                                            <i on:click={() => removeSubject(subject.id)}
                                               class="bi bi-trash flex text-md bg-red-600 text-white p-[3px] rounded-sm"></i>
                                        </div>
                                    </td>
                                </tr>
                            {/each}
                        {/if}
                    {/await}

                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>