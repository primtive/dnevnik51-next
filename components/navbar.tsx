import Link from "next/link";
import React from "react";
import { buttonVariants } from "./ui/button";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"


export const Navbar = () => {

	const links = [
		{
			name: 'Дневник',
			link: '/'
		},
		{
			name: 'Оценки',
			link: '/marks'
		},
		{
			name: 'Статистика',
			link: '/stats'
		}
	]

	return (
		<>
			<div className="hidden md:block">
				{links.map(({ name, link }) => (
					<Link href={link} className={"text-base " + buttonVariants({ variant: "link" })} key={link}>{name}</Link>
				))}
			</div>
			<div className="block md:hidden">
				<NavigationMenu>
					<NavigationMenuList>

						<NavigationMenuItem>
							<NavigationMenuTrigger>
								Меню
							</NavigationMenuTrigger>
							<NavigationMenuContent>
								{links.map((el) => (
									<NavigationMenuLink asChild key={el.link}>
										<a
											href={el.link}
											className={buttonVariants({ variant: 'ghost' }) + ' w-full'}
										>
											<div className="text-sm font-medium leading-none">{el.name}</div>
										</a>
									</NavigationMenuLink>
								))}
							</NavigationMenuContent>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>
			</div>
		</>
	);
};