<script lang="ts">
	import Gemini from '$lib/assets/gemini.png';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Field from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Textarea } from '$lib/components/ui/textarea';
	import { durations, hackathonThemes } from '$lib/constants';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import { type hackathonThemesType, type durationType } from '../types';
	import { cn } from '$lib/utils';

	let durationVal = $state<durationType>('1 hr');
	let themeVal = $state<hackathonThemesType>('AR / VR / Metaverse');

	let themeSearchQuery = $state<string>('');
	let openThemeSearch = $state<boolean>(false);

	let filteredThemeSearch = $derived(
		hackathonThemes.filter((theme) => theme.toLowerCase().includes(themeSearchQuery.toLowerCase()))
	);
	$effect(() => {
		window.addEventListener('click', () => {
			if (openThemeSearch) openThemeSearch = false;
		});
	});
</script>

<div class="flex min-h-screen flex-col bg-linear-to-b from-red-800 to-red-500">
	<nav class="fixed top-0 z-50 w-full bg-white/10 p-6 shadow-md backdrop-blur-md">
		<div class="flex w-full items-center justify-between px-4 md:px-16">
			<p class="text-2xl font-bold tracking-wide text-white">HackFlow</p>
		</div>
	</nav>

	<section
		class="relative flex h-screen flex-col items-center justify-center px-4 pt-24 text-center md:pt-32"
	>
		<span class="mb-4 flex items-center gap-2 text-lg font-bold text-white">
			Powered by
			<Badge class="flex items-center gap-2 rounded-md bg-white/10 px-3 py-1 backdrop-blur-sm">
				<img src={Gemini} alt="Gemini icon" class="mb-1 h-5 w-5" />
				<span class="text-sm font-bold text-blue-500">Gemini</span>
			</Badge>
		</span>

		<h1 class="mb-4 text-5xl leading-tight font-extrabold text-white md:text-6xl">
			Welcome to HackFlow
		</h1>

		<p class="mb-8 max-w-2xl text-xl text-white/80 md:text-2xl">Your AI Hackathon Idea Generator</p>

		<a href="#chat">
			<Button
				size="lg"
				class="rounded-lg bg-white px-8 py-4 font-semibold text-red-700 shadow-xl transition hover:scale-105 hover:bg-white/90"
			>
				Get Started
			</Button>
		</a>
	</section>

	<section id="chat" class="flex w-full flex-col items-center px-4 py-24">
		<p class="mb-4 text-4xl font-semibold text-white">Generate Your Magnum Opus</p>
		<p class="mb-12 max-w-xl text-center text-white/80">
			Fill in your hackathon details and let AI craft a project idea tailored for your team.
		</p>

		<div class="h-full w-full max-w-7xl">
			<div
				class="grid h-full grid-cols-1 gap-8 rounded-xl bg-white/80 p-6 shadow-xl backdrop-blur-md md:grid-cols-2"
			>
				<div class="rounded-lg bg-white p-6 shadow-md">
					<p class="mb-6 text-xl font-semibold text-gray-900">Hackathon Details</p>

					<form action="?/chat" method="POST">
						<Field.Set>
							<Field.Group class="gap-4">
								<Field.Field>
									<Field.Label>Hackathon Name</Field.Label>
									<Input placeholder="e.g. AI for Good Hackathon" />
								</Field.Field>

								<Field.Field>
									<Field.Label>Problem or Theme</Field.Label>
									<Textarea
										rows={4}
										class="resize-none"
										placeholder="Describe the challenge or focus area"
									/>
								</Field.Field>

								<Field.Field>
									<Field.Label>Hackathon Duration</Field.Label>
									<Select.Root type="single" bind:value={durationVal}>
										<Select.Trigger class="w-full">{durationVal}</Select.Trigger>
										<Select.Content>
											{#each durations as duration}
												<Select.Item value={duration} />
											{/each}
										</Select.Content>
									</Select.Root>
								</Field.Field>

								<Field.Field>
									<Field.Label>Theme</Field.Label>

									<div class="relative">
										<Input
											type="text"
											readonly
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
													placeholder="Search themes..."
													class="rounded-none border-b"
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
											</div>
										{/if}
									</div>
								</Field.Field>

								<Field.Field>
									<Field.Label>Team Members</Field.Label>
									<Input type="number" min={1} required defaultValue={1} />
								</Field.Field>

								<Button
									size="lg"
									type="submit"
									class="mt-4 w-full cursor-pointer bg-red-600 text-white hover:bg-red-700"
								>
									Generate Idea
								</Button>
							</Field.Group>
						</Field.Set>
					</form>
				</div>

				<div class=" flex h-full min-h-72 flex-col rounded-lg bg-white/60 p-6 shadow-inner">
					<p class="mb-4 text-xl font-semibold text-gray-900">Your Winning AI Idea</p>
					<div
						class="flex flex-1 flex-col items-center justify-center rounded-md border border-dashed border-gray-300 p-2"
					>
						<p class="max-w-sm text-center text-gray-500">
							Your AI-generated hackathon idea will appear here once you submit the form.
						</p>
					</div>
				</div>
			</div>
		</div>
	</section>

	<footer class="bg-red-600 p-8">
		<div class="mx-auto flex max-w-5xl items-center justify-between">
			<p class="font-semibold text-white">MERAH | HackFlow</p>
			<p class="text-white">Built by DONEWITHWORK</p>
		</div>
	</footer>
</div>
