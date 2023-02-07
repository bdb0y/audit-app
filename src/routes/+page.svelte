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

    let unitId = 1002;

    let personnelId = 299212;


    async function getTopicSubjects() {
        let topicId = -1;
        if (selected_topic)
            topicId = selected_topic.id;
        else return;

        const req = await fetch(`${END_POINT}/api/subject/get_topic_subjects?topicId=${topicId}&unitId=${unitId}`)
        const res = await req.json();

        if (req.ok) {
            console.log(res);
            return res;
            // if (requests.length < 10)
            //     show_more_visible = false;
        } else {
            // show_more_visible = false;
        }
    }

    // create subject

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
        normalWeight: 0
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

        const req = await fetch(`${END_POINT}/api/subject/create_subject`, {
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

        subject_on_create = {
            topicId: subject_on_create.topicId,
            unitId: subject_on_create.unitId,
            personnelId,
            title: '',
            description: '',
            progress: 0,
            weight: 0,
            normalWeight: 0
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
    }

    $: {
        if (selected_period) {
            topics = getTopics();
            selected_topic = undefined;
        }
    }

</script>

<div class="bg-gray-100">
    <div class="px-2 py-2 text-gray-400 text-xs sm:text-md">
        <h1>مدیریت موضوعات</h1>
    </div>
    <div class="grid lg:grid-cols-2 gap-2 px-2">
        <div class="bg-white">
            {#if on_modify_topic}
                <div class="mb-8">
                    <div class="px-4 py-2 flex flex-row items-center">
                        <h1 class="font-bold">ویرایش درصد پیشرفت موضوع</h1>
                        {#if on_new_subject}
                            <i on:click={() => on_new_subject = !on_new_subject}
                               class="bi bi-dash-square flex text-xl text-red-500 hover:text-red-700 cursor-pointer mr-auto"></i>
                        {/if}
                    </div>
                    <hr/>
                    <div class="flex flex-col py-2 px-2 gap-2">
                        <div class="flex flex-col gap-2 text-sm">
                            <div class="flex flex-row items-center">
                                <label for="selected_topic_total_progress">درصد پیشرفت {topic_on_modify.title}</label>
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
                                            on_modify_topic = false;
                                        }}
                                    class="py-2 px-3 rounded-sm bg-slate-200 text-slate-700 text-xs sm:text-md">
                                لغو
                            </button>
                        </div>
                    </div>
                    <hr/>
                </div>
            {/if}
            <div class="px-4 py-2 flex flex-col gap-2">
                {#if selected_period}
                    <span>دوره های فعال</span>
                    <select class="border-2 border-gray-100 w-full mb-4"
                            bind:value={selected_period}>
                        {#each Array.from(periods) as period}
                            <option value="{period}" id="{period}">{period.title}</option>
                        {/each}
                    </select>
                {:else}
                {/if}
                <h1 class="font-bold text-xs sm:text-md">موضوعات موجود در دوره</h1>
            </div>
            <hr/>
            <div class="flex flex-col py-2 px-2 gap-2">
                {#await topics}
                    <span>در حال بارگزاری</span>
                {:then result}
                    {#if result}
                        {#each Array.from(result) as topic}
                            <div on:click={async () => {
                                selected_topic = topic;
                                subject_on_create.topicId = topic.id;
                                subjects = await getTopicSubjects();
                            }}
                                 class="rounded-sm text-sm flex flex-col gap-2 text-xs sm:text-md">
                                <div on:click={() => {
                                    if (opened_topic !== undefined){
                                        opened_topic.is_opened = false;
                                        opened_topic = undefined;
                                    }
                                    topic.is_opened = true;
                                    opened_topic = topic;

                                    topic_on_modify.id = topic.id;
                                    topic_on_modify.title = topic.title;
                                    topic_on_modify.progress = topic.progress;
                                }}
                                     class="py-2 px-4 flex flex-row cursor-pointer items-center gap-4 odd:bg-blue-400 even:bg-blue-500 text-white hover:bg-blue-500">
                                    <i class="bi bi-file-text flex text-lg"></i>
                                    <span class="text-xs sm:text-md">{topic.title}</span>
                                    <span class="mr-auto">{topic.progress}</span>
                                    <i class="bi bi-chevron-{topic.is_opened ? 'down':'left'} flex"></i>
                                </div>
                                {#if topic.is_opened}
                                    <div class="bg-slate-50 px-4 py-3 text-black text-justify leading-6 text-xs sm:text-md">
                                        <p>{topic.description}</p>
                                    </div>
                                    <div class="flex flex-row gap-2">
                                        <button on:click={() => {
                                            on_modify_topic = true;
                                            topic_on_modify.id = topic.id;
                                            topic_on_modify.title = topic.title;
                                            topic_on_modify.progress = topic.progress;
                                        }}
                                                class="py-2 px-3 rounded-sm bg-blue-200 text-blue-700 mr-auto text-xs sm:text-md">
                                            ویرایش پیشرفت
                                        </button>
                                    </div>
                                {/if}
                            </div>
                        {/each}
                    {/if}
                {/await}
            </div>
        </div>
        <div class="bg-white">
            {#if selected_topic}
                <!--{#await subjects}-->
                <!--    <div class="flex flex-col gap-4 justify-center items-center h-full">-->
                <!--        <i class="bi bi-binoculars flex text-4xl"></i>-->
                <!--        <span class="text-sm">هیچ موضوعی برای نمایش یافت نشد</span>-->
                <!--    </div>-->
                <!--{:then subject_result}-->
                {#if on_new_subject}
                    <div class="mb-8">
                        <div class="px-4 py-2 flex flex-row items-center">
                            <h1 class="font-bold">ثبت عنوان جدید در این موضوع</h1>
                            {#if on_new_subject}
                                <i on:click={() => on_new_subject = !on_new_subject}
                                   class="bi bi-dash-square flex text-xl text-red-500 hover:text-red-700 cursor-pointer mr-auto"></i>
                            {/if}
                        </div>
                        <hr/>
                        <div class="flex flex-col py-2 px-2 gap-2">
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
                                    <label for="selected_topic_progress">درصد پیشرفت</label>
                                    <span class="mr-auto">{subject_on_create.progress}/100</span>
                                </div>
                                <input type="range" bind:value={subject_on_create.progress} min=0 max=100
                                       id="selected_topic_progress" class="py-2"
                                       placeholder="موضوع شماره یک"
                                       step="5"/>
                            </div>
                            <button on:click={() => createSubjectOnTopic()}
                                    class="bg-blue-500 text-white py-2 hover:bg-blue-600 rounded-sm">ثبت
                            </button>
                        </div>
                        <hr/>
                    </div>
                {/if}
                {#if on_modify_subject}
                    <div class="mb-8">
                        <div class="px-4 py-2 flex flex-row items-center">
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
                            <div class="flex flex-col gap-2 text-sm">
                                <label for="mselected_topic_title">موضوع</label>
                                <input bind:value={subject_on_modify.title}
                                       id="mselected_topic_title"
                                       class="border-2 border-gray-100 py-2 px-2 rounded-sm"
                                       type="text" placeholder="موضوع شماره یک"/>
                            </div>
                            <div class="flex flex-col gap-2 text-sm">
                                <label for="mselected_topic_description">توضیحات</label>
                                <textarea bind:value={subject_on_modify.description}
                                          id="mselected_topic_description"
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
                                    <label for="mselected_topic_progress">درصد پیشرفت</label>
                                    <span class="mr-auto">{subject_on_modify.progress}/100</span>
                                </div>
                                <input type="range" bind:value={subject_on_modify.progress} min=0 max=100
                                       id="mselected_topic_progress" class="py-2"
                                       placeholder="موضوع شماره یک"
                                       step="5"/>
                            </div>
                            <div class="flex flex-row gap-2">
                                <button on:click={() => modifySubject()}
                                        class="grow bg-blue-500 text-white py-2 hover:bg-blue-600 rounded-sm">ثبت
                                    تغییرات
                                </button>
                                <button on:click={() => {
                                    on_modify_subject = false;
                                }}
                                        class="bg-slate-500 text-white px-8 py-2 hover:bg-slate-600 rounded-sm">لغو
                                </button>
                            </div>
                        </div>
                        <hr/>
                    </div>
                {/if}
                <div class="px-4 py-2 flex flex-row items-center">
                    <h1 class="font-bold text-xs sm:text-md">عناوین ثبت شده در {selected_topic.title}</h1>
                    {#if !on_new_subject}
                        <i on:click={() => {
                            on_new_subject = !on_new_subject;
                            on_modify_subject = false;
                        }}
                           class="bi bi-plus-square flex mr-auto text-xl text-blue-500 cursor-pointer hover:text-blue-700"></i>
                    {/if}
                </div>
                <hr/>
                <div class="flex flex-col py-2 px-2 gap-2">
                    {#if subjects && subjects.length > 0}
                        {#each Array.from(subjects) as subject_item}
                            <div on:click={()=> subject_item.is_opened = !subject_item.is_opened}
                                 class="px-4 py-2 odd:border-blue-300 even:border-blue-400 border-2 text-blue-800 cursor-pointer rounded-sm text-xs sm:text-md flex flex-col gap-4">
                                <div class="flex flex-row items-center gap-4">
                                    <i class="bi bi-file-text flex text-lg"></i>
                                    <span>{subject_item.title}</span>
                                    <div class="mr-auto bg-slate-100 w-16 h-6 rounded-md flex items-center justify-center text-gray-600">
                                        {subject_item.progress}
                                    </div>
                                    <i class="bi bi-chevron-{subject_item.is_opened ? 'down':'left'} flex"></i>
                                </div>
                                {#if subject_item.is_opened }
                                    <div class="flex flex-col">
                                        <p class="text-gray-800 text-justify leading-6 text-xs">
                                            {subject_item.description}
                                        </p>
                                        <div class="flex flex-row gap-2">
                                            <button on:click={() => {
                                            on_modify_subject = true;
                                            on_new_subject = false;
                                            subject_on_modify.id = subject_item.id;
                                            subject_on_modify.topicId = subject_item.topicId;
                                            subject_on_modify.unitId = subject_item.unitId;
                                            subject_on_modify.personnelId = subject_item.personnelId;
                                            subject_on_modify.title = subject_item.title;
                                            subject_on_modify.description = subject_item.description;
                                            subject_on_modify.progress = subject_item.progress;
                                        }}
                                                    class="py-2 px-3 rounded-sm bg-blue-200 text-blue-700 mr-auto text-xs sm:text-md">
                                                ویرایش
                                            </button>
                                            <button on:click={() => {
                                            removeSubject(subject_item.id)
                                        }}
                                                    class="py-2 px-3 rounded-sm bg-red-200 text-red-700 text-xs sm:text-md">
                                                حذف
                                            </button>
                                        </div>
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
                <!--{/await}-->
            {:else}
                <div class="flex flex-col gap-4 justify-center items-center h-full py-4">
                    <i class="bi bi-binoculars flex text-4xl"></i>
                    <span class="text-xs sm:text-md">هیچ موضوعی یافت نشد</span>
                </div>
            {/if}
        </div>
    </div>

</div>