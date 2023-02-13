<script>
    import {END_POINT} from "../constants.js";
    import {onMount} from "svelte";

    let on_new_subject = false;
    let on_modify_subject = false;

    let on_modify_topic = false;

    let subject_progress_value = 0;

    let periods;

    let topics;

    async function getPeriods() {
        const req = await fetch(`${END_POINT}/api/period/get_periods`)
        const res = await req.json();

        if (req.ok) {
            periods = res;
            selected_period = periods[0];
            // console.log(periods);
            // if (requests.length < 10)
            //     show_more_visible = false;
        } else {
            // show_more_visible = false;
        }
    }

    async function getTopics() {
        if (selected_period) {
            console.log(selected_period.id);

            const req = await fetch(`${END_POINT}/api/topic/get_topics?periodId=${selected_period.id}&unitId=${unitId}`)
            const res = await req.json();

            if (req.ok) {
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

    let personnelId = 299212;


    async function getTopicSubjects() {
        let topicId = -1;
        if (selected_topic)
            topicId = selected_topic.id;
        else return;

        console.log(topicId);
        console.log(unitId);

        const req = await fetch(`${END_POINT}/api/subject/get_topic_subjects?topicId=${topicId}&unitId=${unitId}`)
        const res = await req.json();
        console.log(res);

        if (req.ok) {
            console.log(res);
            grouped_items = groupByCategory(res);
            console.log('this is the time');
            console.log(grouped_items);
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
        normalWeight: 0
    }

    let subject_on_modify = {
        id: '',
        topicId: '',
        unitId,
        personnelId,
        title: '',
        description: '',
        progress: 0,
        weight: 0,
        normalWeight: 0,
        category: '',
        isAdmin: false
    }

    let topic_on_modify = {
        id: '',
        title: '',
        progress: ''
    }

    async function createSubjectOnTopic() {
        console.log(JSON.stringify(subject_on_create));

        const form_body = new FormData();
        form_body.append('topicId', subject_on_create.topicId);
        form_body.append('unitId', subject_on_create.unitId);
        form_body.append('personnelId', subject_on_create.personnelId);
        form_body.append('title', subject_on_create.title);
        form_body.append('description', subject_on_create.description);
        form_body.append('progress', subject_on_create.progress);
        form_body.append('weight', subject_on_create.weight);
        form_body.append('normalWeight', subject_on_create.normalWeight);
        form_body.append('category', selected_category.id);

        const req = await fetch(`${END_POINT}/api/subject/create_subject`, {
            method: 'POST',
            body: form_body
        })
        const res = await req.json();

        if (req.ok) {
            console.log(res);
            subjects = await getTopicSubjects();
            console.log(subjects);
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
            category: subject_on_create.category
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

        const req = await fetch(`${END_POINT}/api/subject/update_subject`, {
            method: 'POST',
            body: form_body
        })
        const res = await req.json();

        if (req.ok) {
            console.log(res);
            subjects = await getTopicSubjects();
            console.log(subjects);
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

    onMount(async () => {
        let token = $page.url.searchParams;
        if (token.has("token")) {
            console.log('here is the token')
            console.log(token.has('token') ? token.get('token') : 'not available');
            await goto('/', {replaceState: false})
        }
        await getPeriods();
        // topics = getTopics();
    });

    async function submitTopicProgress() {
        const form_body = new FormData();
        form_body.append('topicId', topic_on_modify.id);
        form_body.append('unitId', unitId);
        form_body.append('progress', topic_on_modify.progress);

        const req = await fetch(`${END_POINT}/api/topic/set_progress`, {
            method: 'POST',
            body: form_body
        })
        const res = await req.json();

        if (req.ok) {
            console.log(res);
            topics = await getTopics();
            console.log(topics);
            // if (requests.length < 10)
            //     show_more_visible = false;
        } else {
            // show_more_visible = false;
        }

        on_modify_topic = false;
        selected_topic = undefined;
    }

    async function removeSubject(subjectId) {
        console.log(JSON.stringify(subject_on_create));

        const form_body = new FormData();
        form_body.append('subjectId', subjectId);

        const req = await fetch(`${END_POINT}/api/subject/delete_subject`, {
            method: 'POST',
            body: form_body
        })
        const res = await req.json();

        if (req.ok) {
            console.log(res);
            subjects = await getTopicSubjects();
            console.log(subjects);
            // if (requests.length < 10)
            //     show_more_visible = false;
        } else {
            // show_more_visible = false;
        }

        on_delete = false;
    }

    $: {
        if (selected_period) {
            topics = getTopics();
            selected_topic = undefined;
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
            && subject_on_create.description
            && subject_on_create.category
            && subject_on_create.title.length > 0
            && subject_on_create.description.length > 0
            && subject_on_create.category.length > 0;
    }

    let is_modify_form_complete = false;

    $: {
        is_modify_form_complete =
            subject_on_modify
            && subject_on_modify.title
            && subject_on_modify.description
            && subject_on_modify.category
            && subject_on_modify.title.length > 0
            && subject_on_modify.description.length > 0
            && subject_on_modify.category.length > 0;

        console.log(is_modify_form_complete);
    }

    let on_show_documents = false;

    let subject_on_show_documents = {
        attachments: []
    }

    let on_delete = false;


</script>


<div class="bg-gray-100 overflow-hidden relative">
    {#if on_new_subject || on_modify_subject || on_show_documents || on_delete}
        <div class="bg-black/60 backdrop-opacity-50 w-screen h-screen fixed top-0 right-0 z-20">
            <dialog in:fly="{{ y: -100, duration: 200 }}" out:fly="{{ y: -100, duration: 200 }}"
                    class="z-20 w-full md:w-3/5 drop-shadow-xl top-48 p-0 dialog-box"
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
                                <input bind:value={subject_on_create.title}
                                       id="selected_topic_title"
                                       class="border-2 border-gray-100 py-2 px-2 rounded-sm"
                                       type="text" placeholder="موضوع شماره یک"/>
                            </div>
                            <div class="flex flex-col gap-2 text-sm">
                                <label for="selected_topic_description">توضیحات</label>
                                <textarea bind:value={subject_on_create.description}
                                          id="selected_topic_description"
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
                                       placeholder="موضوع شماره یک"
                                       step="5"/>
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
                                    <input disabled={subject_on_modify.isAdmin}
                                           bind:value={subject_on_modify.title}
                                           id="mselected_topic_title"
                                           class="border-2 border-gray-100 py-2 px-2 rounded-sm"
                                           type="text" placeholder="موضوع شماره یک"/>
                                </div>
                                <div class="flex flex-col gap-2 text-sm">
                                    <label for="mselected_topic_description">توضیحات</label>
                                    <textarea disabled={subject_on_modify.isAdmin}
                                              bind:value={subject_on_modify.description}
                                              id="mselected_topic_description"
                                              class="border-2 border-gray-100 py-2 px-2 rounded-sm"></textarea>
                                </div>
                            {/if}
                            <div class="flex flex-row gap-2 text-sm">

                            </div>
                            <div class="flex flex-col gap-2 text-sm">
                                <div class="flex flex-row items-center">
                                    <label for="mselected_topic_progress">امتیاز/درصد پیشرفت</label>
                                    <span class="mr-auto">{subject_on_modify.progress}/100</span>
                                </div>
                                <input type="range" bind:value={subject_on_modify.progress} min=0 max=100
                                       id="mselected_topic_progress" class="py-2"
                                       placeholder="موضوع شماره یک"
                                       step="5"/>
                            </div>
                            <div class="px-2 text-left pb-2">
                                <button disabled={!is_modify_form_complete}
                                        on:click={() => modifySubject()}
                                        class="{is_modify_form_complete ? 'bg-blue-500':'bg-slate-500'} text-white py-2 {is_modify_form_complete ? 'hover:bg-blue-600':'hover:bg-slate-600'} rounded-sm mr-auto px-8">
                                    ثبت
                                </button>
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
                                <h1 class="font-bold">بارگیری اسناد</h1>
                            </div>
                            {#if subject_on_show_documents.attachments}
                                <div data-sveltekit-preload-data="off"
                                     class="px-2 flex flex-col gap-2 text-sm">
                                    <span>اسناد بارگزاری شده</span>
                                    <div class="flex flex-row flex-wrap gap-2">
                                        {#each Array.from(subject_on_show_documents.attachments) as file}
                                            <a href="/api/subject/attachments?fileId={file.id}{file.name}"
                                               class="shimmer-effect flex flex-row gap-2 bg-slate-50 rounded-lg text-sm items-center">
                                                <i class="bi bi-cloud-download flex text-lg h-full items-center rounded-r-lg px-2 cursor-pointer"></i>
                                                <span class="pl-2 py-2 text-gray-500">{file.name}</span>
                                            </a>
                                        {/each}
                                    </div>
                                </div>
                            {/if}
                            <div class="px-2 mr-auto">
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
                                selected_topic = topic;
                                subject_on_create.topicId = topic.id;
                                subjects = await getTopicSubjects();
                            }}
                                 class="rounded-sm text-sm flex flex-col gap-2 text-xs sm:text-md">
                                <div in:fly="{{ y: -50, duration: 200 }}" style="background-color: #55BAD7;"
                                     class="flex flex-row cursor-pointer text-white relative">
                                    <div class="z-10 absolute left-2 -top-3 flex flex-row gap-2">
                                        <span style="direction: ltr;background-color: #357CA5"
                                              class="font-bold text-[8px] text-white px-2 py-[1px] rounded-lg">{topic.progress}
                                            امتیاز/درصد پیشرفت</span>
                                        <!--                                        <div class="font-bold text-[8px] bg-blue-200 text-blue-700 px-2 py-[1px] rounded-lg">-->
                                        <!--                                            3 عنوان اضافه شده-->
                                        <!--                                        </div>-->
                                    </div>
                                    <div class="flex flex-row items-center grow">
                                        <div on:click={() => {
                                        console.log('clicked on it');
                                         if (opened_topic !== undefined){
                                            opened_topic.is_opened = false;
                                            opened_topic.is_on_modify_topic = false;
                                            opened_topic = undefined;
                                        }
                                         topic.is_opened = false;
                                         topic.is_on_modify_topic = false;
                                    }} class="flex flex-row items-center grow py-2">
                                            <i class="text-lg bi bi-file-text flex text-lg px-4 py-4"></i>
                                            <!--                                        <span class="text-xs sm:text-md text-justify leading-5">{topic.title.length > 50 ? `${topic.title.substring(0, 50)}...` : topic.title}</span>-->
                                            <span class="text-xs sm:text-md text-justify leading-5">{topic.title}</span>
                                        </div>
                                        {#if !topic.locked}
                                            <i on:click={()=> {
                                        console.log('clicked on modification');

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
                                        {/if}
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
                                    <div class="flex flex-col py-2 px-2 gap-2">
                                        <div class="flex flex-col gap-2 text-sm">
                                            <div class="flex flex-row items-center">
                                                <label for="selected_topic_total_progress">امتیاز/درصد
                                                    پیشرفت {topic_on_modify.title}</label>
                                                <span class="mr-auto">{topic_on_modify.progress}/100</span>
                                            </div>
                                            <input type="range" bind:value={topic_on_modify.progress} min=0 max=100
                                                   id="selected_topic_total_progress" class="py-2"
                                                   step="5"/>
                                        </div>
                                        <div class="flex flex-row gap-2">
                                            <button on:click={() => submitTopicProgress()}
                                                    class="bg-blue-500 text-white py-2 hover:bg-blue-600 rounded-sm grow text-xs sm:text-md">
                                                ثبت
                                            </button>
                                            <button on:click={() => {
                                                topic.is_on_modify_topic = false;
                                            }}
                                                    class="py-2 px-3 rounded-sm bg-slate-200 text-slate-700 text-xs sm:text-md">
                                                لغو
                                            </button>
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
                    <button disabled={on_new_subject}
                            on:click={() => {
                            on_new_subject = !on_new_subject;
                            on_modify_subject = false;
                            getCategories();
                        }}
                            class="text-xs text-blue-700 bg-blue-200 hover:bg-blue-100 whitespace-nowrap px-2 py-2 rounded-sm mr-auto">
                        عنوان جدید
                    </button>
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
                                            <div style="background-color: #58D9EF"
                                                 class="relative text-white cursor-pointer rounded-sm text-xs sm:text-md flex flex-col">
                                                <div class="z-10 absolute left-2 -top-3 flex flex-row">
                                                <span style="direction: ltr;background-color: #357CA5"
                                                      class="font-bold text-[8px] text-white px-2 py-[1px] rounded-lg">{subject_item.progress}
                                                    امتیاز/درصد پیشرفت</span>
                                                </div>
                                                <div class="flex flex-row h-16 items-center">
                                                    <div class="flex flex-row items-center grow">
                                                        <i class="bi bi-file-text flex text-lg px-4 py-4 leading-5"></i>
                                                        <!--                                                        <span>{subject_item.title.length > 50 ? `${subject_item.title.substring(0, 50)}...` : subject_item.title}</span>-->
                                                        <span>{subject_item.title}</span>
                                                    </div>
                                                    {#if !subject_item.locked}
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
                                                        getCategories();
                                                    }}
                                                           class="bi bi bi-pencil flex mr-auto text-lg px-4 h-full items-center hover:bg-blue-200"></i>
                                                    {/if}
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
                                                    {#if subject_item.attachments}
                                                        <i on:click={() => {
                                                            on_new_subject = false;
                                                            on_modify_subject = false;
                                                            on_show_documents = true;
                                                            subject_on_show_documents.attachments = JSON.parse(subject_item.attachments)
                                                        }}
                                                           class="bi bi bi-cloud-download flex text-lg px-4 h-full items-center hover:bg-blue-200"></i>
                                                    {/if}
                                                    <i on:click={()=> subject_item.is_opened = !subject_item.is_opened}
                                                       class="bi bi bi-justify-right flex text-lg px-4 h-full items-center hover:bg-blue-200"></i>
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
             on:click={() => selected_topic = undefined}
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
