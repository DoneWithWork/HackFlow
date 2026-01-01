<script lang="ts">
	import { enhance } from '$app/forms';
	import Container from '$lib/components/Container.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Landing from '$lib/components/Landing.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Field from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Textarea } from '$lib/components/ui/textarea';
	import { durations, hackathonThemes } from '$lib/constants';
	import { cn } from '$lib/utils';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import { type durationType, type hackathonThemesType } from '../types';
	import { Loader } from 'svelte-lucide';
	let durationVal = $state<durationType>('1 hr');
	let themeVal = $state<hackathonThemesType>('AR / VR / Metaverse');

	let themeSearchQuery = $state<string>('');
	let openThemeSearch = $state<boolean>(false);

	let filteredThemeSearch = $derived(
		hackathonThemes.filter((theme) => theme.toLowerCase().includes(themeSearchQuery.toLowerCase()))
	);
	let { data, form } = $props();
	let aiResponse = $state<any>(null);
	$effect(() => {
		const handler = () => (openThemeSearch = false);
		window.addEventListener('click', handler);
		console.log(form?.response);
		return () => window.removeEventListener('click', handler);
	});

	let loading = $state<boolean>(false);
</script>

<Container>
	<Nav />
	<Landing />

	<section id="chat" class="flex w-full flex-col items-center px-4 py-24">
		<p class="mb-4 text-4xl font-semibold text-white">Generate Your Magnum Opus</p>
		<p class="mb-12 max-w-xl text-center text-white/80">
			Fill in your hackathon details and let AI craft a project idea tailored for your team.
		</p>

		<div class="h-full w-full max-w-7xl">
			<div
				class="flex h-full flex-col gap-8 rounded-xl bg-white/80 p-6 shadow-xl backdrop-blur-md md:flex-row"
			>
				<div class="flex-4 rounded-lg bg-white p-6 shadow-md">
					<p class="mb-6 text-xl font-semibold text-gray-900">Hackathon Details</p>

					<form
						action="?/chat#chat"
						method="POST"
						use:enhance={({}) => {
							loading = true;
							return async ({ result }) => {
								loading = false;
								if (result.type === 'success' && result?.data?.response) {
									aiResponse = result.data.response;
								} else {
									aiResponse = null;
								}
							};
						}}
					>
						<Field.Set>
							<Field.Group class="gap-4">
								<Field.Field>
									<Field.Label>Hackathon Name</Field.Label>
									<Input
										required
										minlength={5}
										maxlength={100}
										placeholder="e.g. AI for Good Hackathon"
										name="title"
									/>
									{#if form?.errors?.properties?.title}
										<Field.Error>{form.errors.properties.title}</Field.Error>
									{/if}
								</Field.Field>

								<Field.Field>
									<Field.Label>Problem or Theme</Field.Label>
									<Textarea
										name="description"
										rows={4}
										required
										minlength={10}
										class="resize-none"
										placeholder="Describe the challenge or focus area"
									/>
									{#if form?.errors?.properties?.description}
										<Field.Error>{form.errors.properties.description}</Field.Error>
									{/if}
								</Field.Field>

								<Field.Field>
									<Field.Label>Hackathon Duration</Field.Label>
									<Select.Root type="single" name="duration" bind:value={durationVal}>
										<Select.Trigger class="w-45">
											{#if durationVal}
												{durationVal}
											{:else}
												{durations[0]}
											{/if}
										</Select.Trigger>
										<Select.Content>
											<Select.Group>
												<Select.Label>Durations</Select.Label>
												{#each durations as duration}
													<Select.Item value={duration} label={duration}>
														{duration}
													</Select.Item>
												{/each}
												{#if form?.errors?.properties?.duration}
													<Field.Error>{form.errors.properties.duration}</Field.Error>
												{/if}
											</Select.Group>
										</Select.Content>
									</Select.Root>
								</Field.Field>

								<Field.Field>
									<Field.Label>Theme</Field.Label>

									<div class="relative">
										<Input
											name="theme"
											type="text"
											readonly
											defaultValue={themeVal}
											value={themeVal}
											onclick={(e) => {
												e.stopPropagation();
												openThemeSearch = !openThemeSearch;
												themeSearchQuery = '';
											}}
											class={cn(openThemeSearch && 'rounded-b-none')}
										/>

										<ChevronDown
											class="absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-gray-500"
										/>

										{#if openThemeSearch}
											<div class="absolute z-10 w-full rounded-b-md border bg-white">
												<Input
													type="text"
													name="themeSearch"
													placeholder="Search themes..."
													class="rounded-none border-b"
													onclick={(e) => e.stopPropagation()}
													bind:value={themeSearchQuery}
												/>

												<div class="max-h-40 overflow-y-auto">
													{#each filteredThemeSearch as theme}
														<button
															class="block w-full px-3 py-2 text-left hover:bg-gray-100"
															onclick={() => {
																themeVal = theme;
																openThemeSearch = false;
																themeSearchQuery = '';
															}}
														>
															{theme}
														</button>
													{/each}
												</div>
												{#if form?.errors?.properties?.theme}
													<Field.Error>{form.errors.properties.theme}</Field.Error>
												{/if}
											</div>
										{/if}
									</div>
								</Field.Field>

								<Field.Field>
									<Field.Label>Team Members</Field.Label>
									<Input name="members" type="number" min={1} required defaultValue={1} />
									{#if form?.errors?.properties?.members}
										<Field.Error>{form.errors.properties.members}</Field.Error>
									{/if}
								</Field.Field>

								<Button
									size="lg"
									disabled={loading}
									type="submit"
									class="mt-4 w-full cursor-pointer bg-red-600 text-white hover:bg-red-700"
								>
									{#if loading}
										<span><Loader class="size-7 animate-spin" /></span>
										Generating...
									{:else}
										Generate Idea
									{/if}
								</Button>
							</Field.Group>
						</Field.Set>
					</form>
				</div>

				<div
					class=" flex min-h-72 flex-6 shrink-0 flex-col rounded-lg bg-white/60 p-6 shadow-inner"
				>
					<p class="mb-4 text-xl font-semibold text-gray-900">Your Winning AI Idea</p>

					<div
						class={cn(
							'flex flex-1 flex-col items-center justify-center rounded-md border border-dashed border-gray-300 p-4 transition-opacity duration-700 ease-in-out',
							aiResponse ? 'opacity-100' : 'opacity-0'
						)}
					>
						{#if aiResponse}
							<!-- Pitch -->
							<p class="font-semibold text-gray-800">{aiResponse.pitch}</p>

							<!-- Solution / Description -->
							<p class="mt-2 whitespace-pre-wrap text-gray-700">{aiResponse.solution}</p>

							<!-- Tech Stack -->
							{#if aiResponse.techStack}
								<div class="mt-3 w-full">
									<p class="mb-1 font-semibold text-gray-800">Tech Stack:</p>
									<ul class="list-inside list-disc text-gray-700">
										{#each aiResponse.techStack as tech}
											<li>{tech}</li>
										{/each}
									</ul>
								</div>
							{/if}

							<!-- Core Features -->
							{#if aiResponse.coreFeatures}
								<div class="mt-3 w-full">
									<p class="mb-1 font-semibold text-gray-800">Core Features:</p>
									<ul class="list-inside list-disc text-gray-700">
										{#each aiResponse.coreFeatures as feature}
											<li>{feature}</li>
										{/each}
									</ul>
								</div>
							{/if}

							<!-- Team Allocation -->
							{#if aiResponse.teamAllocation}
								<div class="mt-3 w-full">
									<p class="mb-1 font-semibold text-gray-800">Team Allocation:</p>
									<ul class="list-inside list-disc text-gray-700">
										{#each Object.entries(aiResponse.teamAllocation) as [role, count]}
											<li>{role}: {count}</li>
										{/each}
									</ul>
								</div>
							{/if}
						{:else}
							<p class="max-w-sm text-center text-gray-500">
								Your AI-generated hackathon idea will appear here once you submit the form.
							</p>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</section>

	<Footer />
</Container>
